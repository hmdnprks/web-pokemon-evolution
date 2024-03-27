import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { usePokemonList } from '@component/hooks/usePokemon';
import * as storageHooks from '@component/hooks/usePersistedState';
import { PokemonItemResult } from '@component/interfaces/pokemon';

jest.mock('@component/components/Search/Search', () => {
  const SearchPokemon = () => (
    <div>
      <input role="textbox" type="text" />
      <button>Search</button>
      <button>Clear</button>
    </div>
  );
  SearchPokemon.displayName = 'SearchPokemon';
  return SearchPokemon;
});
jest.mock('@component/components/PokemonList/PokemonList', () => {
  const PokemonList = ({
    pokemons,
    setPokemon,
  }: {
    pokemons: PokemonItemResult[];
    setPokemon: (pokemon: PokemonItemResult) => void;
  }) => (
    <div role="list">
      {pokemons.map((pokemon) => (
        <button key={pokemon.id} onClick={() => setPokemon(pokemon)}>
          {pokemon.name}
        </button>
      ))}
    </div>
  );
  PokemonList.displayName = 'PokemonList';
  return PokemonList;
});
jest.mock('@component/hooks/usePokemon', () => ({
  usePokemonList: jest.fn(),
}));
jest.mock('@component/hooks/usePersistedState', () => ({
  getFromStorage: jest.fn(),
  setToStorage: jest.fn(),
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    (usePokemonList as jest.Mock).mockReturnValue({
      data: { results: [{ id: '1', name: 'Bulbasaur' }] },
      isLoading: false,
      error: null,
      isFetched: true,
    });
    (storageHooks.getFromStorage as jest.Mock).mockReturnValue(null);
    (storageHooks.setToStorage as jest.Mock).mockImplementation(jest.fn());
  });

  it('renders search component and pokemon list', () => {
    render(<Home />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('renders PokemonList with data', () => {
    render(<Home />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('handles error in fetching pokemon list', () => {
    (usePokemonList as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Fetch error'),
    });
    render(<Home />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('navigates to profile if a pokemon is stored', () => {
    (storageHooks.getFromStorage as jest.Mock).mockReturnValue({ id: '1', name: 'Pikachu' });
    render(<Home />);
    expect(pushMock).toHaveBeenCalledWith('/profile');
  });

  it('chooses a pokemon and navigates to the profile page', async () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Bulbasaur'));
    await waitFor(() => fireEvent.click(screen.getByText('I Choose You')));

    expect(storageHooks.setToStorage).toHaveBeenCalledWith('POKEMON_PROFILE', {
      id: '1',
      name: 'Bulbasaur',
    });
    expect(pushMock).toHaveBeenCalledWith('/profile');
  });

  it('clears the search when clear button is clicked', () => {
    render(<Home />);
    userEvent.type(screen.getByRole('textbox'), 'Charmander');
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates pokemon list based on search term', async () => {
    (usePokemonList as jest.Mock)
      .mockReturnValueOnce({
        data: { results: [{ id: '1', name: 'Bulbasaur' }] },
        isLoading: false,
        error: null,
        isFetched: true,
      })
      .mockReturnValueOnce({
        data: { results: [{ id: '2', name: 'Ivysaur' }] },
        isLoading: false,
        error: null,
        isFetched: true,
      });

    render(<Home />);

    userEvent.type(screen.getByRole('textbox'), 'Ivysaur');
    fireEvent.click(screen.getByText('Search'));

    expect(await screen.findByText('Ivysaur')).toBeInTheDocument();
  });

  it('clears the search and pokemon list when clear button is clicked', async () => {
    (usePokemonList as jest.Mock).mockReturnValue({
      data: {
        results: [
          { id: '1', name: 'Bulbasaur' },
          { id: '2', name: 'Ivysaur' },
        ],
      },
      isLoading: false,
      error: null,
      isFetched: true,
    });

    render(<Home />);

    userEvent.type(screen.getByRole('textbox'), 'Bulbasaur');
    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Clear'));

    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

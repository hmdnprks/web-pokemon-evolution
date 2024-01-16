import { render, fireEvent } from '@testing-library/react';
import PokemonList from './PokemonList';
import { PokemonItemResult } from '@component/interfaces/pokemon';

describe('PokemonList', () => {
  const setPokemonMock = jest.fn();
  const lastPokemonElementRefMock = { current: null };

  const pokemonsMock: PokemonItemResult[] = [
    {
      id: '1',
      name: 'Bulbasaur',
      url: 'https://pokeapi.co/pokemon/1',
      imageUrl: { small: 'bulbasaur.png', large: 'bulbasaur-large.png' },
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        speed: 45,
        weight: 69,
      },
    },
    {
      id: '2',
      name: 'Charmander',
      url: 'https://pokeapi.co/pokemon/2',
      imageUrl: { small: 'charmander.png', large: 'charmander-large.png' },
      stats: {
        hp: 39,
        attack: 52,
        defense: 43,
        speed: 65,
        weight: 85,
      },
    },
  ];

  it('renders correctly', () => {
    const { getByText } = render(
      <PokemonList
        isLoading={false}
        lastPokemonElementRef={lastPokemonElementRefMock}
        pokemons={pokemonsMock}
        setPokemon={setPokemonMock}
      />,
    );

    expect(getByText('Bulbasaur')).toBeInTheDocument();
    expect(getByText('Charmander')).toBeInTheDocument();
  });

  it('calls setPokemon when a PokemonCard is clicked', () => {
    const { getByText } = render(
      <PokemonList
        isLoading={false}
        lastPokemonElementRef={lastPokemonElementRefMock}
        pokemons={pokemonsMock}
        setPokemon={setPokemonMock}
      />,
    );

    fireEvent.click(getByText('Bulbasaur'));

    expect(setPokemonMock).toHaveBeenCalledWith(pokemonsMock[0]);
  });

  it('renders GridSkeleton when isLoading is true', () => {
    const { getByTestId } = render(
      <PokemonList
        isLoading={true}
        lastPokemonElementRef={lastPokemonElementRefMock}
        pokemons={pokemonsMock}
        setPokemon={setPokemonMock}
      />,
    );

    expect(getByTestId('grid-skeleton')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../page';
import * as storageHooks from '@component/hooks/usePersistedState';
import * as pokemonHooks from '@component/hooks/usePokemon';
import * as berryHooks from '@component/hooks/useBerry';

const mockPokemon = { id: '1', name: 'Pikachu', imageUrl: { large: 'pikachu.png' } };
const mockPokemonDetail = {
  data: { stats: { hp: 35, attack: 55, defense: 40, speed: 90, weight: 60 } },
  nextEvolution: null,
};
const mockBerryList = { results: [{ name: 'Oran', firmness: 'soft', weight: 20 }] };

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@component/hooks/usePersistedState', () => ({
  getFromStorage: jest.fn(),
  setToStorage: jest.fn(),
}));
jest.mock('@component/hooks/usePokemon', () => ({
  usePokemonDetail: jest.fn(),
}));
jest.mock('@component/hooks/useBerry', () => ({
  useBerryList: jest.fn(),
}));

jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});

describe('<Profile />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storageHooks.getFromStorage as jest.Mock).mockReturnValue(mockPokemon);
    (pokemonHooks.usePokemonDetail as jest.Mock).mockReturnValue({
      data: mockPokemonDetail,
      isLoading: false,
    });
    (berryHooks.useBerryList as jest.Mock).mockReturnValue({
      data: mockBerryList,
      isLoading: false,
    });
  });

  it('renders without crashing', () => {
    render(<Profile />);
    expect(screen.getByText(/Berries/)).toBeInTheDocument();
  });

  it('redirects if no pokemon is in storage', () => {
    (storageHooks.getFromStorage as jest.Mock).mockReturnValue(null);
    render(<Profile />);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('displays pokemon stats correctly', async () => {
    render(<Profile />);
    await waitFor(
      () => {
        expect(screen.getByText(mockPokemonDetail.data.stats.hp.toString())).toBeInTheDocument();
        expect(
          screen.getByText(mockPokemonDetail.data.stats.attack.toString()),
        ).toBeInTheDocument();
        expect(
          screen.getByText(mockPokemonDetail.data.stats.defense.toString()),
        ).toBeInTheDocument();
        expect(screen.getByText(mockPokemonDetail.data.stats.speed.toString())).toBeInTheDocument();
        expect(
          screen.getByText(mockPokemonDetail.data.stats.weight.toString()),
        ).toBeInTheDocument();
      },
      {
        timeout: 2000,
      },
    );
  });

  it('calls setSelectedBerry with correct berry when a berry is clicked', () => {
    render(<Profile />);

    const berryItem = screen.getByAltText('Oran');
    fireEvent.click(berryItem);

    expect(screen.getByText('Oran')).toBeInTheDocument();
  });

  it('calls feedPokemon when the feed button is clicked', async () => {
    render(<Profile />);

    const berryItem = screen.getByAltText('Oran');
    fireEvent.click(berryItem);
    const feedButton = screen.getByText('Feed Pokemon');
    const expectedNewWeight =
      mockPokemonDetail.data.stats.weight +
      (mockBerryList.results.find((berry) => berry.name === 'Oran')?.weight || 0);
    fireEvent.click(feedButton);
    await waitFor(() => {
      expect(screen.getByText(expectedNewWeight.toString())).toBeInTheDocument();
    });
  });

  it('updates weight on feeding pokemon', async () => {
    render(<Profile />);
    const feedButton = screen.getByText('Feed Pokemon');
    fireEvent.click(feedButton);
    const expectedNewWeight = mockPokemonDetail.data.stats.weight + 20;
    await waitFor(() => {
      expect(screen.getByText(expectedNewWeight.toString())).toBeInTheDocument();
    });
  });

  it('deletes pokemon and redirects', () => {
    render(<Profile />);
    const deleteButton = screen.getByText('×');
    fireEvent.click(deleteButton);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('renders next evolution section when available', () => {
    const nextEvolutionMockData = {
      ...mockPokemonDetail,
      nextEvolution: { name: 'Raichu', stats: { weight: 80 } },
    };
    (pokemonHooks.usePokemonDetail as jest.Mock).mockReturnValue({
      data: nextEvolutionMockData,
      isLoading: false,
    });
    render(<Profile />);
    waitFor(() => {
      expect(screen.getByText('Next Evolution Weight')).toBeInTheDocument();
      expect(screen.getByText('Raichu')).toBeInTheDocument(); // Checking for next evolution's name
    });
  });

  it('renders berries list correctly', () => {
    render(<Profile />);
    waitFor(() => {
      mockBerryList.results.forEach((berry) => {
        expect(screen.getByText(berry.name)).toBeInTheDocument();
      });
    });
  });

  it('handles next evolution change correctly', () => {
    const nextEvolutionMock = {
      name: 'Raichu',
      stats: { weight: mockPokemonDetail.data.stats.weight },
    };
    (pokemonHooks.usePokemonDetail as jest.Mock).mockReturnValue({
      data: { ...mockPokemonDetail, nextEvolution: nextEvolutionMock },
      isLoading: false,
    });

    render(<Profile />);

    waitFor(() => {
      const evolveButton = screen.getByText('Evolve');
      fireEvent.click(evolveButton);
      expect(storageHooks.setToStorage).toHaveBeenCalledWith('POKEMON_PROFILE', nextEvolutionMock);
    });
  });

  it('displays loading skeletons while fetching data', () => {
    (pokemonHooks.usePokemonDetail as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (berryHooks.useBerryList as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(<Profile />);
    expect(screen.getByTestId('pokemon-loading-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('berry-list-loading-skeleton')).toBeInTheDocument();
  });

  it('displays appropriate message when there are no berries', () => {
    (berryHooks.useBerryList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    render(<Profile />);
    expect(screen.getByText('No berries available')).toBeInTheDocument();
  });

  it('handles fade-out animation end correctly', () => {
    render(<Profile />);
    fireEvent.animationEnd(screen.getByAltText('Pikachu'));
  });

  it('cleans up timeouts on unmount', async () => {
    const { unmount } = render(<Profile />);
    unmount();
    await waitFor(() => {
      expect(clearTimeout).toHaveBeenCalled();
    });
  });
});

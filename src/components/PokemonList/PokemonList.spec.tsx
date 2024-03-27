import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonList from './PokemonList'; // Adjust the import path according to your project structure
import { PokemonItemResult } from '@component/interfaces/pokemon'; // Adjust import path

const mockPokemons: PokemonItemResult[] = [
  {
    id: '1',
    name: 'bulbasaur',
    imageUrl: {
      small: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      large:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  },
  {
    id: '2',
    name: 'ivysaur',
    imageUrl: {
      small: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      large:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    url: 'https://pokeapi.co/api/v2/pokemon/2/',
  },
];

const setPokemon = jest.fn();
const lastPokemonElementRef = jest.fn();

describe('PokemonList and PokemonCard Components', () => {
  it('renders PokemonList with PokemonCard components correctly', () => {
    render(
      <PokemonList
        isLoading={false}
        lastPokemonElementRef={lastPokemonElementRef}
        pokemons={mockPokemons}
        setPokemon={setPokemon}
      />,
    );
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getAllByRole('list').length).toBe(2);
  });

  it('selects a PokemonCard using keyboard', () => {
    render(
      <PokemonList
        isLoading={false}
        lastPokemonElementRef={lastPokemonElementRef}
        pokemons={mockPokemons}
        setPokemon={setPokemon}
      />,
    );
    const bulbasaurCard = screen.getByText('bulbasaur').closest('div');
    bulbasaurCard && fireEvent.keyDown(bulbasaurCard, { key: 'Enter' });
    expect(setPokemon).toHaveBeenCalledWith(mockPokemons[0]);
  });

  it('renders GridSkeleton when loading', () => {
    render(
      <PokemonList
        isLoading={true}
        lastPokemonElementRef={lastPokemonElementRef}
        pokemons={mockPokemons}
        setPokemon={setPokemon}
      />,
    );
    expect(screen.getByTestId('grid-skeleton')).toBeInTheDocument();
  });

  it('applies the lastPokemonElementRef to the last PokemonCard', () => {
    render(
      <PokemonList
        isLoading={false}
        lastPokemonElementRef={lastPokemonElementRef}
        pokemons={mockPokemons}
        setPokemon={setPokemon}
      />,
    );
    expect(lastPokemonElementRef).toHaveBeenCalled();
  });
});

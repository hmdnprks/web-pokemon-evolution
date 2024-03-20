import React, { useState } from 'react';
import { PokemonItemResult } from '@component/interfaces/pokemon';
import Skeleton from '../Skeletion/Skeleton';

interface PokemonCardProps {
  pokemon: PokemonItemResult;
  onSelect: (pokemon: PokemonItemResult) => void;
  isSelected: boolean;
}

interface PokemonListProps {
  pokemons: PokemonItemResult[];
  setPokemon: (pokemon: PokemonItemResult) => void;
  lastPokemonElementRef: any;
  isLoading: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect, isSelected }) => (
  <div
    className={`p-2 border ${
      isSelected ? 'border-2 border-red-500' : 'border-gray-200'
    } rounded-lg overflow-hidden`}
    onClick={() => onSelect(pokemon)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        onSelect(pokemon);
        e.preventDefault();
      }
    }}
    role="list"
    style={{ cursor: 'pointer' }}
    tabIndex={0}
  >
    <img alt={pokemon.name} className="w-full h-auto" src={pokemon.imageUrl.small} />
    <h2 className="text-center text-sm capitalize overflow-hidden text-ellipsis whitespace-nowrap">
      {pokemon.name}
    </h2>
  </div>
);

const GridSkeleton = () => {
  return (
    <>
      {Array.from(Array(18).keys()).map((_, index) => {
        return <Skeleton key={`skeleton-${index}`} />;
      })}
    </>
  );
};

const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  setPokemon,
  lastPokemonElementRef,
  isLoading,
}) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonItemResult | null>(null);

  const handleSelectPokemon = (pokemon: PokemonItemResult) => {
    setSelectedPokemon(pokemon);
    setPokemon(pokemon);
  };

  return (
    <div
      className="grid lg:grid-cols-4 grid-cols-3 gap-4"
      data-testid={isLoading && 'grid-skeleton'}
    >
      {pokemons.map((pokemon, index) => (
        <div key={pokemon.id} ref={pokemons.length === index + 1 ? lastPokemonElementRef : null}>
          <PokemonCard
            isSelected={selectedPokemon?.id === pokemon.id}
            onSelect={handleSelectPokemon}
            pokemon={pokemon}
          />
        </div>
      ))}
      {isLoading && <GridSkeleton />}
    </div>
  );
};

export default PokemonList;

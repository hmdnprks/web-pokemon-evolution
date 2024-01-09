import { PokemonItemResult } from '@component/interfaces/pokemon';
import { useState } from 'react';

// PokemonCard.tsx
interface PokemonCardProps {
  pokemon: PokemonItemResult;
  onSelect: (pokemon: PokemonItemResult) => void;
  isSelected?: boolean;
}

interface PokemonListProps {
  pokemons: PokemonItemResult[];
  setPokemon: (pokemon: PokemonItemResult) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect, isSelected }) => (
  <div
    className={`p-2 border ${isSelected ? 'border-2 border-red-500' : 'border-gray-200'} rounded-lg overflow-hidden`}
    onClick={() => onSelect(pokemon)}
  >
    <img alt={pokemon.name} className="w-full h-auto" src={pokemon.imageUrl.small} />
    <h2 className="text-center text-sm capitalize overflow-hidden text-ellipsis whitespace-nowrap">{pokemon.name}</h2>
  </div>
);


const PokemonList: React.FC<PokemonListProps> = ({ pokemons, setPokemon }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonItemResult | null>(null);

  const handleSelectPokemon = (pokemon: PokemonItemResult) => {
    setSelectedPokemon(pokemon);
    setPokemon(pokemon);
  };

  if (!pokemons) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid lg:grid-cols-4 grid-cols-3 gap-4">
      {pokemons.map(pokemon => (
        <PokemonCard
          isSelected={selectedPokemon?.id === pokemon.id}
          key={pokemon.id}
          onSelect={handleSelectPokemon}
          pokemon={pokemon}
        />
      ))}
    </div>
  );
};


export default PokemonList;

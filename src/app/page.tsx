'use client';
import SearchPokemon from '../components/Search/Search';
import { useEffect, useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import PokemonList from '@component/components/PokemonList/PokemonList';
import { PokemonItemResult } from '@component/interfaces/pokemon';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import { useRouter } from 'next/navigation';
import Skeleton from '@component/components/Skeletion/Skeleton';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const [pokemon, setPokemon] = useState<PokemonItemResult | null>(null);

  const { data: pokemonList, isLoading, error } = usePokemonList();

  const handleChoosePokemon = (pokemon: PokemonItemResult) => {
    setToStorage('POKEMON_PROFILE', pokemon);
    router.push('/profile');
  };

  useEffect(() => {
    const storedPokemon = getFromStorage('POKEMON_PROFILE');
    if (storedPokemon) {
      router.push('/profile');
    }
  }, []);

  const GridSkeleton = () => {
    return (
      <div className="grid lg:grid-cols-4 grid-cols-3 gap-4">
        {Array.from(Array(18).keys()).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} />

        ))}
      </div>
    );
  };

  return (
    <main className="flex flex-col h-screen">
      <div className="flex justify-center p-5">
        <SearchPokemon searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="flex-grow overflow-auto mt-2 p-5">
        {isLoading ? (
          <GridSkeleton />
        ) : error ? (
          <p>Error fetching the Pokémon list.</p>
        ) : (
          <PokemonList pokemons={pokemonList?.results} setPokemon={setPokemon} />
        )}
      </div>
      <div className="bg-white w-full h-1/5">
        <button
          className="bg-green-800 text-white rounded-full p-3 m-5 fixed bottom-4 left-0 right-0 mx-auto w-11/12 max-w-md"
          disabled={!pokemon}
          onClick={() => pokemon && handleChoosePokemon(pokemon)}
        >
          I Choose You
        </button>

      </div>
    </main>
  );
}

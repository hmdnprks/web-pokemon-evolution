'use client';
import SearchPokemon from '../components/Search/Search';
import { useEffect, useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import PokemonList from '@component/components/PokemonList/PokemonList';
import { PokemonItemResult } from '@component/interfaces/pokemon';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import { useRouter } from 'next/navigation';
import Skeleton from '@component/components/Skeletion/Skeleton';
import { AxiosError } from 'axios';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const [pokemon, setPokemon] = useState<PokemonItemResult | null>(null);

  const { data: pokemonList, isLoading, error } = usePokemonList(searchTerm);

  const errorAxios = error as AxiosError;

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

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

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
        <SearchPokemon onSearch={handleSearch} />
      </div>
      <div className="flex-grow overflow-auto mt-2 p-5">
        {isLoading ? (
          <GridSkeleton />
        ) : errorAxios ? (
          <p>
            {errorAxios.response?.status === 404 ? 'Pokemon not found' : 'Something went wrong'}
          </p>
        ) : (
          <PokemonList pokemons={pokemonList?.results} setPokemon={setPokemon} />
        )}
      </div>
      <div className="bg-white w-full fixed bottom-0 h-20 flex justify-center items-center">
        <button
          className="bg-green-800 disabled:bg-gray-300 text-white rounded-full p-3 mx-4 w-full max-w-md"
          disabled={!pokemon}
          onClick={() => pokemon && handleChoosePokemon(pokemon)}
        >
          I Choose You
        </button>
      </div>
    </main>
  );
}

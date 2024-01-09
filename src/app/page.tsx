'use client';
import SearchPokemon from '../components/Search/Search';
import { useEffect, useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import PokemonList from '@component/components/PokemonList/PokemonList';
import { PokemonItemResult } from '@component/interfaces/pokemon';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const [pokemon, setPokemon] = useState<PokemonItemResult | null>(null);

  const { data, isLoading, error } = usePokemonList();

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

  // useEffect(() => {
  //   if (value) {
  //     router.push('/profile');
  //   }
  // }, [value, router])

  return (
    <main className="p-5 h-screen flex flex-col">
      <div className="flex justify-center">
        <SearchPokemon searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="flex-grow overflow-auto mt-10">
        <PokemonList pokemons={data?.results} setPokemon={(value) => setPokemon(value)} />
      </div>
      <button className="bg-green-800 disabled:bg-gray-300 text-white rounded-full p-3 m-5 self-center w-full"
        disabled={!pokemon}
        onClick={() => pokemon && handleChoosePokemon(pokemon)}>
        I Choose You
      </button>
    </main>
  );
}

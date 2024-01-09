'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import { PokemonItemResult } from '@component/interfaces/pokemon';
import { usePokemonDetail } from '@component/hooks/usePokemon';

interface PokemonStats {
  HP: number;
  Attack: number;
  Defense: number;
  Speed: number;
  Weight: number;
}

export default function Profile() {
  const router = useRouter();
  // Assuming you have a hook to interact with local storage
  const pokemon = getFromStorage('POKEMON_PROFILE') as PokemonItemResult;
  const { data: pokemonDetail, isLoading } = usePokemonDetail(pokemon?.id);

  // Redirect to home if no pokemon is in local storage
  useEffect(() => {
    if (!pokemon) {
      router.push('/');
    }
  }, [pokemon, router]);

  const deletePokemon = () => {
    setToStorage('POKEMON_PROFILE', null);
    router.push('/');
  };

  const pokemonStats: PokemonStats = {
    HP: pokemonDetail?.data?.stats.hp,
    Attack: pokemonDetail?.data.stats.attack,
    Defense: pokemonDetail?.data.stats.defense,
    Speed: pokemonDetail?.data.stats.speed,
    Weight: pokemonDetail?.data.stats.weight,
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <header className="flex justify-center items-center px-4 gap-4">
        <h1 className="text-2xl font-bold capitalize">{pokemon?.name}</h1>
        <button className="text-xl bg-red-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={deletePokemon}>
          &times;
        </button>
      </header>
      <div className="flex justify-center mt-4">
        <img alt={pokemon?.name} className="w-60 h-60 object-cover" src={pokemon?.imageUrl.large} />
      </div>
      <div className="text-center mt-8 px-4 grid grid-cols-3 gap-3">
        {Object.entries(pokemonStats).map(([key, value]) => (
          <div key={key}>
            <div className="text-gray-500 text-sm">{key}</div>
            <div className="text-xl font-bold">{value}</div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 left-0 w-full px-4 py-2">
        <button className="w-full bg-green-800 text-white py-2 rounded-full">Feed Pokemon</button>
      </div>
    </div>
  );
}

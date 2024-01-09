'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import { NextEvolution, PokemonItemResult, PokemonStatsAPIResponse } from '@component/interfaces/pokemon';
import { usePokemonDetail } from '@component/hooks/usePokemon';
import { useBerryList } from '@component/hooks/useBerry';
import { BerryItemResult } from '@component/interfaces/berry';
import BerryList from '@component/components/BerryList/BerryList';
import { firmnessMap } from '@component/constants/berry-weight';
import CountUp from 'react-countup';

interface PokemonStats {
  HP: number;
  Attack: number;
  Defense: number;
  Speed: number;
  Weight: number;
}

export default function Profile() {
  const router = useRouter();
  const pokemon = getFromStorage('POKEMON_PROFILE') as PokemonItemResult;

  const { data: pokemonDetailRes, isLoading } = usePokemonDetail(pokemon?.id);
  const pokemonDetail: PokemonStatsAPIResponse = pokemonDetailRes?.data;
  const nextEvolution: NextEvolution = pokemonDetail?.nextEvolution;
  const [pokemonStats, setPokemonStats] = useState<PokemonStats>({
    HP: 0,
    Attack: 0,
    Defense: 0,
    Speed: 0,
    Weight: 0,
  });
  const [feedHistory, setFeedHistory] = useState<BerryItemResult[]>([]);
  const [weightHistory, setWeightHistory] = useState<number[]>([]);

  const { data: berryList } = useBerryList();
  const berries: BerryItemResult[] = berryList?.results;

  const [selectedBerry, setSelectedBerry] = useState<BerryItemResult | null>(null);

  useEffect(() => {
    if (!pokemon) {
      router.push('/');
    }
  }, [pokemon, router]);

  useEffect(() => {
    if (pokemonDetail) {
      setPokemonStats({
        HP: pokemonDetail?.stats.hp,
        Attack: pokemonDetail?.stats.attack,
        Defense: pokemonDetail?.stats.defense,
        Speed: pokemonDetail?.stats.speed,
        Weight: pokemonDetail?.stats.weight,
      });
    }
  }, [pokemonDetail]);

  const deletePokemon = () => {
    setToStorage('POKEMON_PROFILE', null);
    router.push('/');
  };

  const feedPokemon = () => {
    if (selectedBerry) {
      const newWeight = pokemonStats.Weight + firmnessMap[selectedBerry.firmness];
      setPokemonStats({
        ...pokemonStats,
        Weight: newWeight,
      });
      setFeedHistory([...feedHistory, selectedBerry]);
      setWeightHistory([...weightHistory, firmnessMap[selectedBerry.firmness]]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white py-10">
      <div className="overflow-auto mb-20">
        <header className="flex justify-center items-center px-4 gap-4">
          <h1 className="text-2xl font-bold capitalize">{pokemon?.name}</h1>
          <button className="text-xl bg-red-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={deletePokemon}>
            &times;
          </button>
        </header>
        <div className="flex justify-center mt-4 space-x-4 items-center w-full overflow-hidden">
          <img
            alt={pokemon?.name}
            className="w-60 h-60 object-cover"
            src={pokemon?.imageUrl.large}
          />
          {nextEvolution && (
            <div className="flex items-center justify-center text-lg mx-4 text-gray-600">
              →
            </div>
          )}
          <div>
            <img
              alt={nextEvolution?.name}
              className="w-32 h-32 object-cover opacity-50"
              src={nextEvolution?.imageUrl.large}
            />
            <p className="text-center text-gray-500 text-sm capitalize">{nextEvolution?.name}</p>
          </div>

        </div>
        {nextEvolution && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">Next Evolution Weight</p>
            <p className="text-xl font-bold text-orange-500">{nextEvolution.stats.weight}
              <span className={nextEvolution.stats.weight - pokemonStats.Weight >= 0 ? 'text-red-600' : 'text-green-600'}>
                &nbsp;({nextEvolution.stats.weight - pokemonStats.Weight <= 0 ? '+' : '-'}
                <CountUp duration={2} end={Math.abs(nextEvolution.stats.weight - pokemonStats.Weight)}
                  start={weightHistory.length > 0 ? Math.abs(nextEvolution.stats.weight -
                    pokemonStats.Weight) - weightHistory[weightHistory.length - 1] : 0} />)
              </span>
            </p>
          </div>
        )}
        <div className="text-center mt-8 px-4 grid grid-cols-3 gap-3 justify-items-center">
          {Object.entries(pokemonStats).map(([key, value]) => (
            <div key={key}>
              <div className="text-gray-500 text-sm">{key}</div>
              <div className="text-xl font-bold">
                <CountUp duration={2} end={value} start={(key === 'Weight' && weightHistory.length > 0) ?
                  (value - weightHistory[weightHistory.length - 1]) : 0} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-32 px-4">
          {selectedBerry && (

            <div className="flex justify-center items-center gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-sm">Berries</p>
                <p className="text-xl font-bold capitalize">{selectedBerry?.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Firmness</p>
                <p className="text-xl font-bold capitalize">{selectedBerry?.firmness}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Weight</p>
                <p className="text-xl font-bold capitalize text-orange-500">+{firmnessMap[selectedBerry?.firmness || 'others']}</p>
              </div>
            </div>
          )}
          <BerryList berries={berries} setSelectedBerry={item => setSelectedBerry(item)} />
        </div>
      </div>

      <div className="fixed bottom-8 left-0 w-full px-4 py-2">
        <button
          className="w-full disabled:bg-gray-300 bg-green-800 text-white py-2 rounded-full"
          disabled={!selectedBerry}
          onClick={() => feedPokemon()}>
          Feed Pokemon
        </button>
      </div>
    </div>
  );
}

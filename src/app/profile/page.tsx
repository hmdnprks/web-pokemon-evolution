'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import {
  NextEvolution,
  PokemonItemResult,
  PokemonStatsAPIResponse,
} from '@component/interfaces/pokemon';
import { usePokemonDetail } from '@component/hooks/usePokemon';
import { useBerryList } from '@component/hooks/useBerry';
import { BerryItemResult } from '@component/interfaces/berry';
import BerryList from '@component/components/BerryList/BerryList';
import { firmnessMap } from '@component/constants/berry-weight';
import CountUp from 'react-countup';
import ChevronAnimation from '@component/components/ChevronAnimation/ChevronAnimation';
import { clearTimeout } from 'timers';

interface PokemonStats {
  HP: number;
  Attack: number;
  Defense: number;
  Speed: number;
  Weight: number;
}

interface BerryItem extends BerryItemResult {
  weight: number;
}

export default function Profile() {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonItemResult | null>(
    getFromStorage('POKEMON_PROFILE'),
  );

  const { data: pokemonDetailRes, isLoading: isLoadingPokemon } = usePokemonDetail(
    pokemon?.id || '',
  );
  const pokemonDetail: PokemonStatsAPIResponse = pokemonDetailRes?.data;
  const nextEvolution: NextEvolution = pokemonDetail?.nextEvolution;

  const [pokemonStats, setPokemonStats] = useState<PokemonStats>({
    HP: 0,
    Attack: 0,
    Defense: 0,
    Speed: 0,
    Weight: 0,
  });
  const [feedHistory, setFeedHistory] = useState<BerryItem[]>([]);
  const [weightHistory, setWeightHistory] = useState<number[]>([]);

  const { data: berryList, isLoading: isLoadingBerries } = useBerryList();
  const berries: BerryItemResult[] = berryList?.results;

  const [selectedBerry, setSelectedBerry] = useState<BerryItemResult | null>(null);
  const [showChevronUp, setShowChevronUp] = useState(false);
  const [showChevronDown, setShowChevronDown] = useState(false);
  const [chevronTimeoutId, setChevronTimeoutId] = useState<number | null>(null);
  const [fadeOutComplete, setFadeOutComplete] = useState(false);

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
      setWeightHistory([pokemonDetail?.stats.weight]);
    }
  }, [pokemonDetail]);

  useEffect(() => {
    return () => {
      if (chevronTimeoutId) {
        clearTimeout(chevronTimeoutId);
      }
    };
  }, []);

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
      setFeedHistory([
        ...feedHistory,
        {
          ...selectedBerry,
          weight: firmnessMap[selectedBerry.firmness],
        },
      ]);
      setWeightHistory([...weightHistory, newWeight]);

      setShowChevronUp(true);
      const id = setTimeout(() => setShowChevronUp(false), 1000);
      setChevronTimeoutId(id as unknown as number);
    }
  };

  const handleFadeOutAnimationEnd = () => {
    setFadeOutComplete(true);
  };

  const handleNextEvolutionChange = () => {
    setToStorage('POKEMON_PROFILE', nextEvolution);
    setPokemon(nextEvolution);
    setWeightHistory([pokemonStats.Weight]);
    setFeedHistory([]);
  };

  const BasicSkeleton = () => {
    return (
      <div className="animate-pulse p-1 overflow-hidden">
        <div className="h-6 bg-gray-300 rounded" />
      </div>
    );
  };

  const PokemonSkeleton = () => {
    return (
      <div className="animate-pulse p-2 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-300 h-48 w-full" />
        <div className="h-6 bg-gray-300 rounded mt-2 w-3/4 mx-auto" />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white py-10">
      <div>
        <header className="flex justify-center items-center px-4 gap-4">
          {isLoadingPokemon && (
            <div className="w-32">
              <BasicSkeleton />
            </div>
          )}
          {!isLoadingPokemon && (
            <>
              <h1 className="text-2xl font-bold capitalize">{pokemon?.name}</h1>
              <button
                className="text-xl bg-red-200 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={deletePokemon}
              >
                &times;
              </button>
            </>
          )}
        </header>
        {isLoadingPokemon && (
          <div className="p-8">
            <PokemonSkeleton />
          </div>
        )}
        {!isLoadingPokemon && (
          <div className="flex justify-center mt-4 space-x-2 items-center w-full overflow-hidden p-4">
            {!fadeOutComplete && (
              <img
                alt={pokemon?.name}
                className={`w-48 h-48 object-cover`}
                onAnimationEnd={handleFadeOutAnimationEnd}
                src={pokemon?.imageUrl.large}
              />
            )}
            {nextEvolution && (
              <>
                {!fadeOutComplete && (
                  <div>
                    <img alt="arrow-right" className="w-16 h-16" src="/arrow.svg" />
                  </div>
                )}
                <div>
                  <img
                    alt={nextEvolution?.name}
                    className="w-28 h-28 object-cover"
                    src={nextEvolution?.imageUrl.large}
                  />
                  <p className="text-center text-gray-500 text-sm capitalize">
                    {nextEvolution?.name}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        {!isLoadingPokemon && nextEvolution && (
          <div className="text-center mt-2">
            <p className="text-gray-500 text-sm">Next Evolution Weight</p>
            <div className="flex font-bold text-xl justify-center gap-1 mt-2">
              <p className="self-center">
                <span className=" text-orange-500">{nextEvolution.stats.weight}</span>
                <span
                  className={`${
                    nextEvolution.stats.weight - pokemonStats.Weight >= 0
                      ? 'text-red-600'
                      : 'text-green-600 '
                  } text-xs`}
                >
                  &nbsp;({nextEvolution.stats.weight - pokemonStats.Weight <= 0 ? '+' : '-'}
                  <CountUp
                    duration={2}
                    end={Math.abs(nextEvolution.stats.weight - pokemonStats.Weight)}
                    start={Math.abs(
                      nextEvolution.stats.weight - weightHistory[weightHistory.length - 2],
                    )}
                  />
                  )
                </span>
              </p>
            </div>
            {nextEvolution.stats.weight - pokemonStats.Weight <= 0 && (
              <button
                className="px-3 py-2 rounded-full bg-orange-500 text-white mt-2 font-bold w-1/3"
                onClick={handleNextEvolutionChange}
              >
                Evolve
              </button>
            )}
          </div>
        )}
        {!isLoadingPokemon && !nextEvolution && (
          <div className="mx-auto p-4 py-2 bg-red-300 rounded-full text-white w-max flex justify-center items-center">
            <span>End of Evolution Chain</span>
          </div>
        )}
        <div className="text-center mt-8 px-4 grid grid-cols-3 gap-3 justify-items-center">
          {Object.entries(pokemonStats).map(([key, value]) => (
            <div key={key}>
              <div className="text-gray-500 text-sm">{key}</div>
              {isLoadingPokemon && (
                <div className="w-12">
                  <BasicSkeleton />
                </div>
              )}
              {!isLoadingPokemon && (
                <div
                  className={`text-xl font-bold ${key === 'Weight' && 'flex justify-center'} gap-2`}
                >
                  <CountUp
                    duration={2}
                    end={value}
                    start={
                      key === 'Weight' && feedHistory.length > 0
                        ? value - feedHistory[feedHistory.length - 1].weight
                        : 0
                    }
                  />
                  {key === 'Weight' && showChevronUp && <ChevronAnimation arrow="up" />}
                  {key === 'Weight' && showChevronDown && <ChevronAnimation arrow="down" />}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-16 px-4">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div>
              <p className="text-gray-500 text-sm">Berries</p>
              <p className="text-lg font-bold capitalize">{selectedBerry?.name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Firmness</p>
              <p className="text-lg font-bold capitalize">{selectedBerry?.firmness || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Weight</p>
              <p className={`text-lg font-bold capitalize ${selectedBerry && 'text-orange-500'}`}>
                {selectedBerry ? `+${firmnessMap[selectedBerry?.firmness || 'others']}` : '-'}
              </p>
            </div>
          </div>
          <BerryList
            berries={berries}
            isLoading={isLoadingBerries}
            setSelectedBerry={(item) => setSelectedBerry(item)}
          />
        </div>
      </div>

      <div className="w-full px-4 py-2 mt-8">
        <button
          className="w-full disabled:bg-gray-300 bg-green-800 text-white py-2 rounded-full"
          disabled={!selectedBerry}
          onClick={() => feedPokemon()}
        >
          Feed Pokemon
        </button>
      </div>
    </div>
  );
}

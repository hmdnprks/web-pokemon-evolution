/* eslint-disable max-lines */
'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { firmnessMap, prohibitionBerryMap } from '@component/constants/berry-weight';
import CountUp from 'react-countup';
import ChevronAnimation from '@component/components/ChevronAnimation/ChevronAnimation';
import { clearTimeout } from 'timers';
import { useSwipeable } from 'react-swipeable';
import Modal from '@component/components/Modal/Modal';
import InformationIcon from '@component/components/Icons/Information/InformationIcon';
import ModalContent from './ModalContent';

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
  const observer = useRef<IntersectionObserver | null>(null);

  const [pokemon, setPokemon] = useState<PokemonItemResult | null>(
    getFromStorage('POKEMON_PROFILE'),
  );

  const { data: pokemonDetailRes, isLoading: isLoadingPokemon } = usePokemonDetail(
    pokemon?.id || '',
  );
  const pokemonDetail: PokemonStatsAPIResponse = pokemonDetailRes?.data;

  const [pokemonStats, setPokemonStats] = useState<PokemonStats>({
    HP: 0,
    Attack: 0,
    Defense: 0,
    Speed: 0,
    Weight: 0,
  });
  const [feedHistory, setFeedHistory] = useState<BerryItem[]>([]);
  const [weightHistory, setWeightHistory] = useState<number[]>([]);

  const [offsetBerry, setOffsetBerry] = useState(0);
  const limitBerry = 20;

  const {
    data: berryList,
    isLoading: isLoadingBerries,
    isFetched: isFetchedBerries,
  } = useBerryList(limitBerry, offsetBerry);
  const berries: BerryItemResult[] = berryList?.results;

  const [berriesData, setBerriesData] = useState<BerryItemResult[]>([]);

  const [selectedBerry, setSelectedBerry] = useState<BerryItemResult | null>(null);
  const [showChevronUp, setShowChevronUp] = useState(false);
  const [showChevronDown, setShowChevronDown] = useState(false);
  const [chevronTimeoutId, setChevronTimeoutId] = useState<number | null>(null);
  const [fadeOutComplete, setFadeOutComplete] = useState(false);

  const [nextEvolutions, setNextEvolutions] = useState<NextEvolution[]>([]);
  const [selectedEvolutionIndex, setSelectedEvolutionIndex] = useState<number>(0);
  const [lockEvolution, setLockEvolution] = useState(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

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

  useEffect(() => {
    // Assuming pokemonDetail.nextEvolutions is an array of evolutions
    if (pokemonDetail && pokemonDetail.nextEvolutions) {
      setNextEvolutions(pokemonDetail.nextEvolutions);

      setLockEvolution(pokemonDetail.nextEvolutions.length === 1);
    }
  }, [pokemonDetail]);

  useEffect(() => {
    if (isFetchedBerries) {
      setBerriesData((prevState) => [...prevState, ...(berries || [])]);
    }
  }, [isFetchedBerries, berries]);

  const deletePokemon = () => {
    setToStorage('POKEMON_PROFILE', null);
    router.push('/');
  };

  const feedPokemon = () => {
    if (selectedBerry && isEvolutionSelected()) {
      let weightChange = firmnessMap[selectedBerry.firmness] || 0;
      const lastBerry = feedHistory[feedHistory.length - 1];

      if (lastBerry && selectedBerry.firmness === lastBerry.firmness) {
        const prohibitionRule = prohibitionBerryMap.find(
          (rule) => rule.before === selectedBerry.firmness && rule.after === selectedBerry.firmness,
        );
        if (prohibitionRule) {
          weightChange = -prohibitionRule.weight;
        }
      }

      const newWeight = pokemonStats.Weight + weightChange;

      setPokemonStats({
        ...pokemonStats,
        Weight: newWeight,
      });
      setFeedHistory([
        ...feedHistory,
        {
          ...selectedBerry,
          weight: weightChange,
        },
      ]);
      setWeightHistory([...weightHistory, newWeight]);

      setShowChevronUp(weightChange > 0);
      setShowChevronDown(weightChange < 0);
      const id = setTimeout(() => {
        setShowChevronUp(false);
        setShowChevronDown(false);
      }, 1000);
      setChevronTimeoutId(id as unknown as number);
    }
  };

  const handleFadeOutAnimationEnd = () => {
    setFadeOutComplete(true);
  };

  const handleNextEvolutionChange = () => {
    setToStorage('POKEMON_PROFILE', nextEvolutions[selectedEvolutionIndex]);
    setPokemon(nextEvolutions[selectedEvolutionIndex]);
    setWeightHistory([pokemonStats.Weight]);
    setFeedHistory([]);
  };

  const isEvolutionSelected = () => {
    return nextEvolutions.length > 0 && selectedEvolutionIndex !== null;
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!lockEvolution) {
        setSelectedEvolutionIndex((i) => Math.min(i + 1, nextEvolutions.length - 1));
      }
    },
    onSwipedRight: () => {
      if (!lockEvolution) {
        setSelectedEvolutionIndex((i) => Math.max(i - 1, 0));
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  const loadMoreBerries = () => {
    setOffsetBerry((prevOffset) => prevOffset + limitBerry);
  };

  const lastBerryElementRef = useCallback(
    (node: any) => {
      if (isLoadingBerries) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoadingBerries) {
          loadMoreBerries();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingBerries],
  );

  const currentWeightDifference = Math.abs(
    nextEvolutions[selectedEvolutionIndex]?.stats.weight - pokemonStats.Weight,
  );

  const startValue =
    weightHistory.length >= 2
      ? Math.abs(
        nextEvolutions[selectedEvolutionIndex]?.stats.weight -
            weightHistory[weightHistory.length - 2],
      )
      : currentWeightDifference;

  const BasicSkeleton = () => {
    return (
      <div className="animate-pulse p-1 overflow-hidden" data-testid="basic-loading-skeleton">
        <div className="h-6 bg-gray-300 rounded" />
      </div>
    );
  };

  const PokemonSkeleton = () => {
    return (
      <div
        className="animate-pulse p-2 border border-gray-200 rounded-lg overflow-hidden"
        data-testid="pokemon-loading-skeleton"
      >
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
          <div className="flex justify-center mt-4 space-x-2 items-center w-full p-4">
            {!fadeOutComplete && (
              <img
                alt={pokemon?.name}
                className="w-48 h-48 object-cover"
                onAnimationEnd={handleFadeOutAnimationEnd}
                src={pokemon?.imageUrl.large}
              />
            )}
            {nextEvolutions && nextEvolutions.length > 0 && (
              <>
                {!fadeOutComplete && (
                  <div>
                    <img alt="arrow-right" className="w-16 h-16" src="/arrow.svg" />
                  </div>
                )}
                <div
                  className="flex w-full overflow-x-scroll hide-scroll-bar"
                  {...(!lockEvolution ? handlers : {})}
                >
                  <div className="flex transition-transform duration-300 ease-in-out min-w-full">
                    {nextEvolutions.map((evolution, index) => (
                      <div
                        className={`flex-shrink-0 flex-grow-0 ${
                          index === selectedEvolutionIndex ? 'active' : ''
                        }`}
                        key={evolution.id}
                        style={{ width: '100%', maxWidth: '100vw' }}
                      >
                        <div className="flex justify-center items-center">
                          {lockEvolution ? (
                            <button
                              className="w-6/12 bg-orange-300 text-white py-2 rounded-full text-sm flex justify-center items-center"
                              onClick={() => setLockEvolution(true)}
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              className="w-9/12 mt-2 bg-orange-500 text-white py-2 rounded-full text-sm flex justify-center items-center"
                              onClick={() => setLockEvolution(true)}
                            >
                              Pick Evolution
                            </button>
                          )}
                        </div>

                        <img
                          alt={evolution.name}
                          className="object-cover opacity-50 hover:opacity-100"
                          src={evolution.imageUrl.large}
                          style={{ width: '100%', height: 'auto' }}
                        />
                        <p className="text-center text-gray-500 text-sm capitalize mt-2 font-semibold">
                          {evolution.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {!isLoadingPokemon && selectedEvolutionIndex !== null && nextEvolutions.length > 0 && (
          <div className="text-center mt-2">
            <p className="text-gray-500 text-sm">Next Evolution Weight</p>
            <div className="flex font-bold text-xl justify-center gap-1 mt-2">
              <p className="self-center">
                <span className=" text-orange-500">
                  {nextEvolutions[selectedEvolutionIndex]?.stats.weight}
                </span>
                <span
                  className={`${
                    nextEvolutions[selectedEvolutionIndex]?.stats.weight - pokemonStats.Weight >= 0
                      ? 'text-red-600'
                      : 'text-green-600 '
                  } text-xs`}
                >
                  &nbsp;(
                  {nextEvolutions[selectedEvolutionIndex]?.stats.weight - pokemonStats.Weight <= 0
                    ? '+'
                    : '-'}
                  <CountUp duration={2} end={currentWeightDifference} start={startValue} />)
                </span>
              </p>
            </div>
            {nextEvolutions[selectedEvolutionIndex]?.stats.weight - pokemonStats.Weight <= 0 && (
              <button
                className="px-3 py-2 rounded-full bg-orange-500 text-white mt-2 font-bold w-1/3"
                onClick={handleNextEvolutionChange}
              >
                Evolve
              </button>
            )}
          </div>
        )}
        {!isLoadingPokemon && nextEvolutions.length === 0 && (
          <div className="mx-auto p-4 py-2 bg-red-300 rounded-full text-white w-max flex justify-center items-center">
            <span>End of Evolution Chain</span>
          </div>
        )}
        <div className="text-center mt-8 px-4 grid grid-cols-3 gap-3 justify-items-center">
          {Object.entries(pokemonStats).map(([key, value]) => (
            <div key={key}>
              <div
                className={`text-gray-500 text-sm ${
                  key === 'Weight' && 'flex align-middle justify-center gap-1'
                }`}
              >
                {key}{' '}
                {key === 'Weight' && (
                  <button onClick={openModal}>
                    <InformationIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
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
              <p className="text-lg font-bold capitalize">
                {selectedBerry?.firmness.replaceAll('-', ' ') || '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Weight</p>
              <p className={`text-lg font-bold capitalize ${selectedBerry && 'text-orange-500'}`}>
                {selectedBerry ? `+${firmnessMap[selectedBerry?.firmness || 'others']}` : '-'}
              </p>
            </div>
          </div>
          <BerryList
            berries={berriesData}
            isLoading={isLoadingBerries}
            lastBerryElementRef={lastBerryElementRef}
            setSelectedBerry={(item) => setSelectedBerry(item)}
          />
        </div>
      </div>

      <div className="w-full px-4 py-2 mt-8">
        <button
          className="w-full disabled:bg-gray-300 bg-green-800 text-white py-2 rounded-full"
          disabled={!selectedBerry || !isEvolutionSelected()}
          onClick={() => feedPokemon()}
        >
          Feed Pokemon
        </button>
      </div>

      <Modal closeModal={closeModal} isOpen={isOpen}>
        <div className="mt-2">
          <ModalContent />
        </div>
      </Modal>
    </div>
  );
}

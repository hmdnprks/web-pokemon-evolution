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
import { firmnessMap, prohibitionBerryMap } from '@component/constants/berry-weight';
import { clearTimeout } from 'timers';
import Modal from '@component/components/Modal/Modal';
import ModalContent from './ModalContent';
import PokemonHeader from './PokemonHeader';
import PokemonSkeleton from './PokemonSkeleton';
import FeedBerries from './FeedBerries';
import PokemonDisplay from './PokemonDisplay';
import PokemonStatsComponent from './PokemonStats';
import FeedButton from './FeedButton';

export interface PokemonStats {
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

  const {
    data: pokemonDetailRes,
    isLoading: isLoadingPokemon,
    isFetched,
  } = usePokemonDetail(pokemon?.id || '');
  const pokemonDetail: PokemonStatsAPIResponse = pokemonDetailRes?.data;

  const [pokemonStats, setPokemonStats] = useState<PokemonStats>(
    () => getFromStorage('POKEMON_STATS') || { HP: 0, Attack: 0, Defense: 0, Speed: 0, Weight: 0 },
  );

  const [feedHistory, setFeedHistory] = useState<BerryItem[]>(
    () => getFromStorage('FEED_HISTORY') || [],
  );
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

  const [nextEvolutions, setNextEvolutions] = useState<NextEvolution[]>(
    () => getFromStorage('NEXT_EVOLUTIONS') || [],
  );
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
    const storedStatsJson = getFromStorage('POKEMON_STATS');
    const storedStats = storedStatsJson || null;

    if (!storedStats && isFetched) {
      const initialStats = {
        HP: pokemonDetail.stats.hp,
        Attack: pokemonDetail.stats.attack,
        Defense: pokemonDetail.stats.defense,
        Speed: pokemonDetail.stats.speed,
        Weight: pokemonDetail.stats.weight,
      };

      setPokemonStats(initialStats);
      setWeightHistory([pokemonDetail.stats.weight]);
    }

    if (isFetched && pokemonDetail.nextEvolutions) {
      setNextEvolutions(pokemonDetail.nextEvolutions);

      setLockEvolution(pokemonDetail.nextEvolutions.length === 1);
    }
  }, [isFetched, pokemonDetail]);

  useEffect(() => {
    return () => {
      if (chevronTimeoutId) {
        clearTimeout(chevronTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (isFetchedBerries) {
      setBerriesData((prevState) => [...prevState, ...(berries || [])]);
    }
  }, [isFetchedBerries, berries]);

  useEffect(() => {
    if (pokemonStats.Weight > 0) {
      saveStatsToLocal();
    }
  }, [pokemonStats, feedHistory, nextEvolutions]);

  const deletePokemon = () => {
    deleteLocalStats();
    router.push('/');
  };

  const saveStatsToLocal = () => {
    setToStorage('POKEMON_STATS', pokemonStats);
    setToStorage('FEED_HISTORY', feedHistory);
    setToStorage('NEXT_EVOLUTIONS', nextEvolutions);
  };

  const deleteLocalStats = () => {
    localStorage.removeItem('POKEMON_PROFILE');
    localStorage.removeItem('POKEMON_STATS');
    localStorage.removeItem('FEED_HISTORY');
    localStorage.removeItem('NEXT_EVOLUTIONS');
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

      const newWeight = Math.max(0, pokemonStats.Weight + weightChange);

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

  const handleNextEvolutionChange = () => {
    setToStorage('POKEMON_PROFILE', nextEvolutions[selectedEvolutionIndex]);
    setPokemon(nextEvolutions[selectedEvolutionIndex]);
    setWeightHistory([pokemonStats.Weight]);
    setFeedHistory([]);
    saveStatsToLocal();
  };

  const isEvolutionSelected = () => {
    return nextEvolutions.length > 0 && selectedEvolutionIndex !== null;
  };

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

  return (
    <div className="flex flex-col h-screen bg-white py-10">
      <div>
        <PokemonHeader
          isLoadingPokemon={isLoadingPokemon}
          onDelete={deletePokemon}
          pokemonName={pokemon?.name || ''}
        />
        {isLoadingPokemon && (
          <div className="p-8">
            <PokemonSkeleton />
          </div>
        )}
        <PokemonDisplay
          handleNextEvolutionChange={handleNextEvolutionChange}
          isLoadingPokemon={isLoadingPokemon}
          lockEvolution={lockEvolution}
          nextEvolutions={nextEvolutions}
          pokemon={pokemon}
          pokemonStats={pokemonStats}
          setLockEvolution={setLockEvolution}
          weightHistory={weightHistory}
        />

        <PokemonStatsComponent
          feedHistory={feedHistory}
          isLoadingPokemon={isLoadingPokemon}
          openModal={openModal}
          pokemonStats={pokemonStats}
          showChevronDown={showChevronDown}
          showChevronUp={showChevronUp}
        />
        <FeedBerries
          berriesData={berriesData}
          isLoading={isLoadingBerries}
          lastElementRef={lastBerryElementRef}
          selectedBerry={selectedBerry}
          setSelectedBerry={setSelectedBerry}
        />
      </div>

      <FeedButton
        feedPokemon={feedPokemon}
        isEvolutionSelected={isEvolutionSelected}
        selectedBerry={selectedBerry}
      />

      <Modal closeModal={closeModal} isOpen={isOpen}>
        <div className="mt-2">
          <ModalContent />
        </div>
      </Modal>
    </div>
  );
}

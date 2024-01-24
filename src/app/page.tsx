'use client';
import SearchPokemon from '../components/Search/Search';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import PokemonList from '@component/components/PokemonList/PokemonList';
import { PokemonItemResult } from '@component/interfaces/pokemon';
import { getFromStorage, setToStorage } from '@component/hooks/usePersistedState';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);

  const [pokemonData, setPokemonData] = useState<PokemonItemResult[]>([]);
  const [pokemon, setPokemon] = useState<PokemonItemResult | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const {
    data: pokemonList,
    isLoading,
    error,
    isFetched,
  } = usePokemonList(searchTerm, limit, offset);

  const errorAxios = error as AxiosError;

  const handleChoosePokemon = (pokemon: PokemonItemResult) => {
    setToStorage('POKEMON_PROFILE', pokemon);
    router.push('/profile');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPokemonData([]);
    setOffset(0);
  };

  useEffect(() => {
    if (isFetched) {
      if (searchTerm) {
        setPokemonData(pokemonList?.results || []);
      } else {
        setPokemonData((prevState) => [...prevState, ...(pokemonList?.results || [])]);
      }
    }
  }, [isFetched, pokemonList?.results, searchTerm]);

  useEffect(() => {
    const storedPokemon = getFromStorage('POKEMON_PROFILE');
    if (storedPokemon) {
      router.push('/profile');
    }
  }, []);

  const lastPokemonElementRef = useCallback(
    (node: any) => {
      if (isLoading || searchTerm) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMorePokemons();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, searchTerm],
  );

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setOffset(0);
  };

  const loadMorePokemons = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return (
    <main className="flex flex-col h-screen">
      <div className="flex justify-center p-5">
        <SearchPokemon clearSearch={handleClearSearch} onSearch={handleSearch} />
      </div>
      <div className="flex-grow overflow-auto mt-2 p-5 pb-20">
        {errorAxios ? (
          <p>
            {errorAxios.response?.status === 404 ? 'Pokemon not found' : 'Something went wrong'}
          </p>
        ) : (
          <PokemonList
            isLoading={isLoading}
            lastPokemonElementRef={lastPokemonElementRef}
            pokemons={pokemonData}
            setPokemon={setPokemon}
          />
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

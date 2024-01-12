import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPokemonList = async (searchTerm: string, limit: number, offset: number) => {
  const { data } = await axios.get('/api/pokemon', {
    params: {
      keyword: searchTerm,
      limit,
      offset,
    },
  });
  return data;
};

const fetchPokemonDetail = async (id: string) => {
  const { data } = await axios.get(`/api/pokemon/${id}`);
  return data;
};

export const usePokemonList = (searchTerm: string, limit: number, offset: number) => {
  return useQuery({
    queryKey: ['pokemonList', searchTerm, limit, offset],
    queryFn: () => fetchPokemonList(searchTerm, limit, offset),
  });
};

export const usePokemonDetail = (id: string) => {
  return useQuery({ queryKey: ['pokemonDetail', id], queryFn: () => fetchPokemonDetail(id) });
};

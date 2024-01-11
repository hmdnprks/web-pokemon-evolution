import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPokemonList = async (searchTerm: string) => {
  const { data } = await axios.get('/api/pokemon', {
    params: {
      keyword: searchTerm,
    },
  });
  return data;
};

const fetchPokemonDetail = async (id: string) => {
  const { data } = await axios.get(`/api/pokemon/${id}`);
  return data;
};

export const usePokemonList = (searchTerm: string) => {
  return useQuery({
    queryKey: ['pokemonList', searchTerm],
    queryFn: () => fetchPokemonList(searchTerm),
  });
};

export const usePokemonDetail = (id: string) => {
  return useQuery({ queryKey: ['pokemonDetail', id], queryFn: () => fetchPokemonDetail(id) });
};

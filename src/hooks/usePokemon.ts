import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPokemonList = async () => {
  const { data } = await axios.get('/api/pokemon');
  return data;
};

const fetchPokemonDetail = async (id: string) => {
  const { data } = await axios.get(`/api/pokemon/${id}`);
  return data;
};

export const usePokemonList = () => {
  return useQuery({ queryKey: ['pokemonList'], queryFn: fetchPokemonList });
};

export const usePokemonDetail = (id: string) => {
  return useQuery({ queryKey: ['pokemonDetail', id], queryFn: () => fetchPokemonDetail(id) });
};

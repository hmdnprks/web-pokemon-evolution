import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBerryList = async (limit: number, offset: number) => {
  const { data } = await axios.get('/api/berry', {
    params: {
      limit,
      offset,
    },
  });
  return data;
};

export const useBerryList = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ['berryList', limit, offset],
    queryFn: () => fetchBerryList(limit, offset),
  });
};

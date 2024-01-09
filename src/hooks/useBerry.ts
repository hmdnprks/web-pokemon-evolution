import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBerryList = async () => {
  const { data } = await axios.get('/api/berry');
  return data;
};

export const useBerryList = () => {
  return useQuery({ queryKey: ['berryList'], queryFn: fetchBerryList });
};

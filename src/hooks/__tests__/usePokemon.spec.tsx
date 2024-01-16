import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePokemonList, usePokemonDetail } from '../usePokemon';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: any }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('usePokemonList', () => {
  it('fetches successfully data from an API', async () => {
    const mockData = {
      data: {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          // more pokemons...
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockData);

    const { result } = renderHook(() => usePokemonList('bulbasaur', 10, 0), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData.data);
  });

  it('handles error', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePokemonList('bulbasaur', 10, 0), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current?.error?.message).toEqual(errorMessage);
  });
});

describe('usePokemonDetail', () => {
  it('fetches successfully data from an API', async () => {
    const mockData = {
      data: {
        name: 'bulbasaur',
        // more details...
      },
    };

    mockedAxios.get.mockResolvedValue(mockData);

    const { result } = renderHook(() => usePokemonDetail('1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData.data);
  });

  it('handles error', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePokemonDetail('1'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current?.error?.message).toEqual(errorMessage);
  });
});

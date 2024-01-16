import { renderHook, act } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useBerryList } from '../useBerry';

jest.mock('@tanstack/react-query');
jest.mock('axios');

describe('useBerry', () => {
  it('calls useQuery with correct arguments', () => {
    renderHook(() => useBerryList());

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['berryList'],
      queryFn: expect.any(Function),
    });
  });

  it('calls axios.get when useQuery fetch function is invoked', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValueOnce({ data: { results: [] } });

    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      return {
        data: queryFn(),
        error: null,
        isLoading: false,
        isSuccess: true,
      };
    });

    const { result } = renderHook(() => useBerryList());

    await act(async () => {
      await result.current.data;
    });

    expect(axios.get).toHaveBeenCalledWith('/api/berry');
  });
});

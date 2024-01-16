import { renderHook, act } from '@testing-library/react';
import ls from 'localstorage-slim';
import { usePersistedState, getFromStorage, setToStorage } from '../usePersistedState';

jest.mock('localstorage-slim');

describe('usePersistedState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets value from local storage when initialized', () => {
    ls.get = jest.fn().mockReturnValueOnce('test value');

    const { result } = renderHook(() => usePersistedState('testKey', 'default'));

    expect(ls.get).toHaveBeenCalledWith('testKey', { decrypt: true });
    expect(result.current[0]).toBe('test value');
  });

  it('uses default value when local storage is empty', () => {
    ls.get = jest.fn().mockReturnValueOnce(null);

    const { result } = renderHook(() => usePersistedState('testKey', 'default'));

    expect(ls.get).toHaveBeenCalledWith('testKey', { decrypt: true });
    expect(result.current[0]).toBe('default');
  });

  it('sets value to local storage', () => {
    ls.set = jest.fn();

    const { result } = renderHook(() => usePersistedState('testKey', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(ls.set).toHaveBeenCalledWith('testKey', 'new value', { encrypt: true });
    expect(result.current[0]).toBe('new value');
  });
});

describe('getFromStorage', () => {
  it('gets value from local storage', () => {
    ls.get = jest.fn().mockReturnValueOnce('test value');

    const result = getFromStorage('testKey');

    expect(ls.get).toHaveBeenCalledWith('testKey', { decrypt: true });
    expect(result).toBe('test value');
  });

  it('returns null when window is undefined', () => {
    const originalWindow = global.window;
    Object.defineProperty(global, 'window', { value: undefined, writable: true });

    const result = getFromStorage('testKey');

    expect(result).toBeNull();

    Object.defineProperty(global, 'window', { value: originalWindow, writable: true });
  });
});

describe('setToStorage', () => {
  it('sets value to local storage', () => {
    ls.set = jest.fn();

    setToStorage('testKey', 'test value');

    expect(ls.set).toHaveBeenCalledWith('testKey', 'test value', { encrypt: true });
  });
});

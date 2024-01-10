/* eslint-disable no-unused-vars */
/* eslint-disable unused-vars/no-unused-vars */
import { useEffect, useState } from 'react';
import ls from 'localstorage-slim';

type StorageKey = string;
type StoredValue<T> = T | null;

function getFromStorage<T>(key: StorageKey): StoredValue<T> {
  if (typeof window !== 'undefined') {
    ls.config.storage = localStorage;
    return ls.get(key, { decrypt: true }) as StoredValue<T>;
  }
  return null;
}

function setToStorage<T>(key: StorageKey, value: StoredValue<T>): void {
  if (typeof window !== 'undefined') {
    ls.config.storage = localStorage;
    ls.set(key, value, { encrypt: true });
  }
}

function usePersistedState<T>(key: StorageKey, defaultValue: T): [StoredValue<T>,
  (value: T) => void] {
  const [state, setState] = useState<StoredValue<T>>(() => getFromStorage(key) ?? defaultValue);

  useEffect(() => {
    setToStorage(key, state);
  }, [key, state]);

  return [state, setState];
}

export { getFromStorage, setToStorage, usePersistedState };

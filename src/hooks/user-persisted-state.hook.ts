import { useSyncExternalStore, useCallback } from 'react';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const identity = (v: string) => v;

export const usePersistedState = <T>(
  key: string,
  initial: T,
  parse: (raw: string) => T,
  serialize: (value: T) => string,
) => {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const stored = localStorage.getItem(key);
      return stored === null ? initial : parse(stored);
    },
    () => initial,
  );

  const set = useCallback(
    (next: T) => {
      localStorage.setItem(key, serialize(next));
      window.dispatchEvent(new Event('storage'));
    },
    [key, serialize],
  );

  return [value, set] as const;
};

export const usePersistedString = (key: string, initial: string) => usePersistedState(key, initial, identity, identity);

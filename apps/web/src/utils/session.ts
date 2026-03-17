import { CONFIG } from 'src/config';

import { Storage } from './storage';

const memorySession: Record<string, string> = {};

const getItem = (key: string): string | undefined => {
  const cacheValue = memorySession[key];

  if (cacheValue) return cacheValue;

  const storedValue = Storage.localStore.getItem(key) || undefined;

  if (storedValue) memorySession[key] = storedValue;

  return storedValue;
};

const setItem = (key: string, value: string | null): void => {
  if (value) {
    Storage.localStore.setItem(key, value);
    memorySession[key] = value;
  } else {
    Storage.localStore.removeItem(key);
    delete memorySession[key];
  }
};

export const getSessionToken = (): string | undefined =>
  getItem(CONFIG.storageKey);

export const isAuthenticated = (): boolean => getSessionToken() !== undefined;

export const setSessionToken = (token: string | null): void => {
  setItem(CONFIG.storageKey, token);
};

export const logout = (): void => {
  setItem(CONFIG.storageKey, null);
};

export * as Session from './session';

function storageFactory(getStorage: () => Storage): Storage {
  let inMemoryStorage: Record<string, string> = {};

  function isSupported(): boolean {
    try {
      const testKey = '__storage_test__';
      getStorage().setItem(testKey, testKey);
      getStorage().removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  function getItem(name: string): string | null {
    if (isSupported()) {
      return getStorage().getItem(name);
    }
    return inMemoryStorage[name] ?? null;
  }

  function setItem(name: string, value: string): void {
    if (isSupported()) {
      getStorage().setItem(name, value);
    } else {
      inMemoryStorage[name] = value;
    }
  }

  function removeItem(name: string): void {
    if (isSupported()) {
      getStorage().removeItem(name);
    } else {
      delete inMemoryStorage[name];
    }
  }

  function clear(): void {
    if (isSupported()) {
      getStorage().clear();
    } else {
      inMemoryStorage = {};
    }
  }

  function key(index: number): string | null {
    if (isSupported()) {
      return getStorage().key(index);
    }
    return Object.keys(inMemoryStorage)[index] || null;
  }

  function length(): number {
    if (isSupported()) {
      return getStorage().length;
    }
    return Object.keys(inMemoryStorage).length;
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    key,
    get length() {
      return length();
    },
  };
}

export const localStore = storageFactory(() => localStorage);
export const sessionStore = storageFactory(() => sessionStorage);

export * as Storage from './storage';

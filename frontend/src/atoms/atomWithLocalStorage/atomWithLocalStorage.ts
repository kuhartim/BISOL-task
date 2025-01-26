import { atomWithStorage } from "jotai/utils";

// Wraps atomWithStorage for local storage
// Also handles that value is presented in atom even in the first render
export const atomWithLocalStorage = <T>(key: string, defaultValue: T) =>
  atomWithStorage<T>(
    key,
    (() => {
      const valueInLocalStorage = localStorage.getItem(key);
      if (valueInLocalStorage) {
        try {
          return JSON.parse(valueInLocalStorage);
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    })()
  );

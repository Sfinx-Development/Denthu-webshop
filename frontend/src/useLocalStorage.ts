import { useEffect, useState } from "react";

function getItemWithFallback<T>(key: string, fallback: T): T {
  const item = localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.log("ERROR", error);
    }
  }
  return fallback;
}

export default function useLocalStorageState<T>(initialValue: T, key: string) {
  const [state, setState] = useState<T>(() =>
    getItemWithFallback(key, initialValue)
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState] as const;
}

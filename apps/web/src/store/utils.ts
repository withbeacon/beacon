import type { WritableAtom } from "jotai";
import { atom } from "jotai";

export function persistedAtom<T>(
  key: string,
  initialValue: T
): WritableAtom<T, T, void> {
  function getInitialValue(): T {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const item = localStorage.getItem(key);

    if (item === null) {
      return initialValue;
    }

    return JSON.parse(item);
  }

  const baseAtom = atom<T>(getInitialValue());

  return atom<T, T, void>(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;

      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
}

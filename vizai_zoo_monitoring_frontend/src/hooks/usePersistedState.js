import { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * usePersistedState: persist a piece of state to localStorage, with JSON serialization.
 * Returns [value, setValue, reset].
 */
export default function usePersistedState(key, initialValue) {
  const keyRef = useRef(key);
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(keyRef.current);
      if (raw !== null) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(keyRef.current, JSON.stringify(state));
    } catch {
      // ignore quota
    }
  }, [state]);

  const reset = () => {
    setState(typeof initialValue === 'function' ? initialValue() : initialValue);
  };

  return [state, setState, reset];
}

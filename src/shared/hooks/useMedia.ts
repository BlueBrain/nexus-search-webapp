import { useEffect, useState } from 'react';
import { isBrowser } from '../utils';

export default function useMedia(
  queries: string[],
  values: number[],
  defaultValue: number
) {
  const match = () =>
    values[queries.findIndex((q: string) => matchMedia(q).matches)] ||
    defaultValue;
  const [value, set] = useState(match);
  useEffect(() => {
    const handler = () => set(match);
    if (isBrowser) {
      window.addEventListener('resize', handler);
    }
    return () => {
      if (isBrowser) {
        window.removeEventListener('resize', handler);
      }
    };
  }, []);
  return value;
}

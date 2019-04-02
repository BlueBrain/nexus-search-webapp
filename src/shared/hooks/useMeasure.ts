import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useMeasure() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [bounds, set] = React.useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [ro] = React.useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  React.useEffect(() => {
    if (ref && ref.current) {
      ro.observe(ref.current);
    }
    return () => ro.disconnect();
  }, [ref]);
  return [{ ref }, bounds];
}

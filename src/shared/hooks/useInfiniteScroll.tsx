import * as React from 'react';
import { isBrowser } from '../utils';

// Watch an when a scrolling element reaches the bottom, then callback!
const useInfiniteScroll = (
  callback: VoidFunction,
  isFetching: boolean,
  loadAtPercentRevealed: number
) => {
  const ref = React.useRef<HTMLDivElement>(null);
  if (!isBrowser) {
    return [{ ref }];
  }

  React.useEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (ref && ref.current) {
        ref.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, isFetching]);

  const [scrollHeight, setScrollHeight] = React.useState<number>(0);

  const handleScroll = () => {
    if (!ref || !ref.current) {
      return;
    }
    if (ref.current.scrollHeight < scrollHeight) {
      return;
    }
    if (
      !isFetching &&
      ref.current.offsetHeight + ref.current.scrollTop >=
        ref.current.scrollHeight * loadAtPercentRevealed
    ) {
      setScrollHeight(ref.current.scrollHeight);
      callback();
      return;
    }
  };

  return [{ ref }];
};

export default useInfiniteScroll;

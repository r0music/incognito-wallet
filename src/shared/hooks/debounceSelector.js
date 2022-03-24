import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const useDebounceSelector = (
  fn,
  equalFn,
  time = 400,
) => {
  const [_, setSate] = useState();
  const refData = useRef();
  const refTimeout = useRef();

  useSelector((state: any) => {
    const now_state = fn(state);
    if (now_state === refData.current) {
      return;
    }
    if (equalFn?.(refData.current, now_state)) {
      return;
    }
    refData.current = now_state;
    clearTimeout(refTimeout.current);
    refTimeout.current = setTimeout(() => {
      setSate(refData.current);
    }, time);

    return;
  });

  useEffect(() => {
    return () => clearTimeout(refTimeout.current);
  }, []);

  return refData.current;
};

export default useDebounceSelector;

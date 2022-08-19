import { useRef, useEffect } from "react";

const useEventListener = (key, callback, target = window) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e) => callbackRef.current(e);
    target.addEventListener(key, handler);

    return () => target.removeEventListener(key, handler);
  }, [key, target]);
};

export default useEventListener;

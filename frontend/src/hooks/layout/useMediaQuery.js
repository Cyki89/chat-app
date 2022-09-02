import { useEffect, useState } from "react";
import useEventListener from "../utils/useEventListener";

const useMediaQuery = (mediaQuery) => {
  const [isMatch, setIsMatch] = useState(false);
  const [mediaQueryList, setMediaQueryList] = useState();

  useEffect(() => {
    const list = window.matchMedia(mediaQuery);
    setMediaQueryList(list);
    setIsMatch(list.matches);
  }, [mediaQuery]);

  useEventListener("change", (e) => setIsMatch(e.matches), mediaQueryList);

  return isMatch;
};

export default useMediaQuery;

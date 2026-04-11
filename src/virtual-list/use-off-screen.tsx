import * as React from "react";

export const useOffScreen = () => {
  const ref = React.useRef({});

  const addDomToCache = (key, dom) => {
    ref.current[key] = dom;
  }

  const getDomFromCahce = (key) => {
    return ref.current[key];
  }

  return {
    addDomToCache,
    getDomFromCahce,
    ref
  }
};
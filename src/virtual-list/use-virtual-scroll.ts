import * as React from "react";

function areNumberListEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// [8, 9, 10] -> [6, 7, 8, 9, 10, 11, 12]
function buildActiveIndexs(visiableIndexs, itemCount, overscan) {
  const activeIndexs = [...visiableIndexs];

  let i = overscan;
  while (i > 0) {
    const minValue = activeIndexs[0] - 1;
    if (minValue >= 0) {
      activeIndexs.unshift(minValue);
    }

    const maxValue = activeIndexs[activeIndexs.length - 1] + 1;
    if (maxValue <= itemCount) {
      activeIndexs.push(maxValue);
    }

    i--;
  }

  return activeIndexs;
}

export function useVirtualScroll({ itemCount = 5, overscan = 5 }) {
  const rootRef = React.useRef(null);
  const targetItemMap = React.useRef({});

  const [activeIndexs, setActiveIndexs] = React.useState([]);
  const visiableIndexsSet = React.useRef(new Set());
  const [visiableIndexs, setVisiableIndexs] = React.useState([]);

  const recomputeRanges = () => {
    const nextVisiableList = Array.from(visiableIndexsSet.current).sort(
      (a, b) => a - b,
    );
    setVisiableIndexs((current) =>
      areNumberListEqual(current, nextVisiableList)
        ? current
        : nextVisiableList,
    );
    const nextActiveIndexs = buildActiveIndexs(
      nextVisiableList,
      itemCount,
      overscan,
    );
    setActiveIndexs((current) =>
      areNumberListEqual(current, nextActiveIndexs)
        ? current
        : nextActiveIndexs,
    );
  };

  React.useEffect(() => {
    const options = {
      root: rootRef.current,
      rootMargin: "0px",
      scrollMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      let changed = false;
      entries.forEach((entry) => {
        const itemKey = Number(entry.target.dataset.virtualKey);
        if (entry.isIntersecting) {
          if (!visiableIndexsSet.current.has(itemKey)) {
            visiableIndexsSet.current.add(itemKey);
            changed = true;
          }
          return;
        }
        visiableIndexsSet.current.delete(itemKey);
      });
      if (changed) {
        recomputeRanges();
      }
    }, options);

    Object.keys(targetItemMap.current).forEach((key) => {
      observer.observe(targetItemMap.current[key].node);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setItemRef = (node, key) => {
    targetItemMap.current[key] = {
      node,
    };
  };

  return {
    rootRef,
    setItemRef,
    activeIndexs,
    visiableIndexs,
  };
}

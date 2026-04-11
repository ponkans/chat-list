import { useVirtualScroll } from "./use-virtual-scroll";
import { useOffScreen } from "./use-off-screen";
import type { ChatItem } from "./type";

interface VirtualListProps {
  items: ChatItem[];
  renderItem: (item: ChatItem, index: number) => React.ReactNode;
  defaultItemHeight: number;
}

const VirtualList = (props: VirtualListProps) => {
  const { items, renderItem, defaultItemHeight = 30 } = props;

  const { rootRef, setItemRef, activeIndexs, visibleIndexs } = useVirtualScroll(
    { itemCount: items.length, overscan: 5 },
  );
  console.log("activeIndexs", activeIndexs);
  console.log("visibleIndexs", visibleIndexs);

  const { addDomToCache, getDomFromCahce, ref } = useOffScreen();
  console.log(ref, "ref.current");

  return (
    <div
      ref={rootRef}
      style={{ height: "70vh", overflowY: "auto", background: "aliceblue" }}
    >
      {items.map((item, index) => {
        const isActive = activeIndexs.includes(index);
        const isVisible = visibleIndexs.includes(index);

        const cacheDom = getDomFromCahce(item.key);
        const activeDom = cacheDom || renderItem(item, index);
        if (!cacheDom && isVisible) {
          addDomToCache(item.key, activeDom);
        }

        const defaultDom = (
          <div style={{ height: defaultItemHeight }}>{index}</div>
        );

        return (
          <div
            key={item.key}
            data-virtual-index={index}
            ref={(node) => setItemRef(node, item.key)}
          >
            {isActive ? activeDom : defaultDom}
          </div>
        );
      })}
    </div>
  );
};

export default VirtualList;

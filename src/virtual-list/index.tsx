import { useVirtualScroll } from "./use-virtual-scroll";
import type { ChatItem } from "./type";

interface VirtualListProps {
  items: ChatItem[];
  defaultItemHeight: number;
}

const VirtualList = (props: VirtualListProps) => {
  const { items, defaultItemHeight = 30 } = props;
  const { rootRef, setItemRef, activeIndexs, visiableIndexs } =
    useVirtualScroll({ itemCount: items.length, overscan: 5 });

  console.log("activeIndexs", activeIndexs);
  console.log("visiableIndexs", visiableIndexs);

  return (
    <div
      ref={rootRef}
      style={{ height: "70vh", overflowY: "auto", background: "aliceblue" }}
    >
      {items.map((item, index) => {
        if (activeIndexs.includes(index)) {
          return (
            <div
              data-virtual-key={item.key}
              ref={(node) => setItemRef(node, item.key)}
              key={item.key}
            >
              {item.text}
            </div>
          );
        }
        return (
          <div
            data-virtual-key={item.key}
            ref={(node) => setItemRef(node, item.key)}
            key={item.key}
            style={{ height: defaultItemHeight }}
          >
            {index}
          </div>
        );
      })}
    </div>
  );
};

export default VirtualList;

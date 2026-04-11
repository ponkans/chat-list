import * as React from "react";
import VirtualList from "./virtual-list";
import type { ChatItem } from "./virtual-list/type";

function genarateList(count: number) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      key: i,
      role: i % 2 === 0 ? "user" : "agent",
      text: `this index is ${i}`,
    });
  }

  return list;
}

const App = () => {
  const [items] = React.useState<ChatItem[]>(() => genarateList(50));

  return (
    <div>
      <VirtualList
        items={items}
        renderItem={(item) => (
          <div style={{ height: "100px" }}>{item.text}</div>
        )}
        defaultItemHeight={80}
      />
    </div>
  );
};

export default App;

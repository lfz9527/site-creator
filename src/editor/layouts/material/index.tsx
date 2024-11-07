import React from "react";
import { ItemType } from "@editor/item-type";
import ComponentItem from "@/editor/common/component-item";
import { useComponents } from "@editor/stores";

const Material: React.FC = () => {
  const { addComponent } = useComponents();

  // 拖拽结束时触发的回调
  const onDragEnd = (dropResult: any) => {
    addComponent({
      id: String(new Date().getTime()),
      name: dropResult.name,
      props: dropResult.props,
      type: "normal",
    },dropResult.id);
  };
  return (
    <div className="flex p-[10px] gap-4 flex-wrap">
      <ComponentItem
        onDragEnd={onDragEnd}
        description="按钮"
        name={ItemType.Button}
      />
      <ComponentItem
        onDragEnd={onDragEnd}
        description="间距"
        name={ItemType.Space}
      />
    </div>
  );
};

export default Material;

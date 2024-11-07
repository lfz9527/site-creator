import { useDrag } from "react-dnd";
import { ItemType } from "@editor/item-type";
import React from "react";

interface ComponentItemProps {
  // 组件名称
  name: string;
  // 组件描述
  description: string;
  // 拖拽结束回调
  onDragEnd: any;
}

const ComponentItem: React.FC<ComponentItemProps> = ({
  name,
  description,
  onDragEnd,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: name,
    end: (_, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult) return;
      if (onDragEnd) {
        const option = {
          name,
          props: name === ItemType.Button? { children: "按钮" } : {},
          ...dropResult,
        }
        console.log('dropResult-----',dropResult);
        // 拖拽结束回调
        onDragEnd(option);
      }
    },
    collect: (monitor) => ({
      // 是否正在拖拽
      isDragging: monitor.isDragging(),
      // 拖拽中的组件
      handlerId: monitor.getHandlerId(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      ref={drag}
      className="border-dashed border-[1px] border-[gray] bg-white cursor-move py-[8px] px-[20px] rounded-lg"
      style={{
        opacity,
      }}
    >
      {description}
    </div>
  );
};

export default ComponentItem;

import { useDrop as useDndDrop } from "react-dnd";
import { getAcceptDrop } from "@editor/utils";

const useDrop = (id: string, componentName: string) => {
  const [{ canDrop }, drop] = useDndDrop(() => ({
    accept: getAcceptDrop(componentName),
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // 这里把当前组件的id返回出去，在拖拽结束事件里可以拿到这个id。
      return {
        id,
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return {
    drop,
    canDrop,
  };
};

export default useDrop;

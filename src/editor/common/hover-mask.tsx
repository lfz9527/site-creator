import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Tag } from "antd";
import { createPortal } from "react-dom";
import { useComponentConfigStore, useComponents } from "@editor/stores";
import { getComponentById } from "@editor/utils";

interface Props {
  // 容器class
  containerClassName: string;
  // 相对容器id
  offsetContainerIdName: string;
  // 组件id
  componentId: string;
}

function SelectedMask(
  { containerClassName, offsetContainerIdName, componentId }: Props,
  ref: any
) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    toolsTop: 0,
    toolsLeft: 0,
  });

  const { componentConfig } = useComponentConfigStore();
  const { components } = useComponents();

  // 对外暴露更新位置方法
  useImperativeHandle(ref, () => ({
    updatePosition,
  }));

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  const updatePosition = () => {
    if (!componentId) return;

    const container = document.querySelector(`#${offsetContainerIdName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);

    if (!node) return;

    // 获取节点位置
    const { top, left, width, height } = node.getBoundingClientRect();
    // 获取容器位置
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let toolsTop = top - containerTop + container.scrollTop;
    let toolsLeft = left - containerLeft + width;

    if (toolsTop <= 0) {
      toolsTop -= -30;
      toolsLeft -= 10;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      toolsTop,
      toolsLeft,
    });
  };

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(66, 133, 244, 0.04)",
          border: "1px dashed rgb(66, 133, 244)",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 120,
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.toolsLeft,
          top: position.toolsTop,
          zIndex: 120,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <div
          style={{
            padding: "0 8px",
            backgroundColor: "#1890ff",
            borderRadius: 4,
            color: "#fff",
            fontSize: "12px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {componentConfig[curComponent?.name || ""]?.desc}
        </div>
      </div>
    </>,

    document.querySelector(`.${containerClassName}`)!
  );
}

export default forwardRef(SelectedMask);

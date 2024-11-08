import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from "react";
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

  const toolRef = useRef<HTMLElement>(null);
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

    const toolHeight = toolRef?.current?.clientHeight || 0;

    let toolsTop = top - containerTop + container.scrollTop;
    let toolsLeft = left - containerLeft + width;

    // 如果工具组件的高度超过了容器的高度，那么就将工具组件的位置向下移动到组件的下方
    if (toolsTop - toolHeight <= 20) {
      toolsTop = toolsTop + height + 30;
    } else {
      toolsTop = toolsTop + 16;
    }

    if (toolsTop <= 0) {
      toolsTop -= -30;
      toolsLeft -= 10;
    }

    setPosition({
      top: top - containerTop + container.scrollTop + 16,
      left: left - containerLeft + container.scrollTop + 16,
      width,
      height,
      toolsTop: toolsTop,
      toolsLeft: toolsLeft + 16,
    });
  };

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  const curComponentConfig = componentConfig[curComponent?.name || ""];
  const { isRoot, desc, name } = curComponentConfig;

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(66, 133, 244, 0.04)",
          border: "2px dashed var(--edit-primary-color)",
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
          left: isRoot ? position.width + 16 : position.toolsLeft,
          top: isRoot ? position.top : position.toolsTop,
          zIndex: 120,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <div className="px-[4px] py-0 bg-[var(--edit-primary-color)] rounded-[2px] text-white text-xs cursor-pointer space whitespace-nowrap">
          {desc || name}
        </div>
      </div>
    </>,

    document.querySelector(`.${containerClassName}`)!
  );
}

export default forwardRef(SelectedMask);

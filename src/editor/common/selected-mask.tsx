import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { observeContainer } from "@editor/utils";
import { useComponents, useComponentConfigStore } from "@editor/stores";
import { getComponentById } from "@editor/utils";

interface Props {
  // 组件id
  componentId: string;
  // 容器class
  containerClassName: string;
  // 相对容器class
  offsetContainerIdName: string;
}

function SelectedMask(
  { componentId, containerClassName, offsetContainerIdName }: Props,
  ref: any
) {
  const toolRef = useRef<HTMLElement>();
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    toolsTop: 0,
    toolsLeft: 0,
    rootToolsTop: 0,
    rootToolsLeft: 0,
  });
  const { componentConfig } = useComponentConfigStore();
  const { components, deleteComponent, setCurComponentId } = useComponents();
  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  const curComponentConfig = componentConfig[curComponent?.name || ""];
  const { isRoot, desc } = curComponentConfig;

  // 对外暴露更新位置方法
  useImperativeHandle(ref, () => ({
    updatePosition,
  }));

  useEffect(() => {
    const { resizeObserver, container } = observeContainer(
      () => {
        updatePosition();
      },
      { dataComponentId: componentId }
    );
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [componentId]);

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  function updatePosition() {
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

    const toolHeight = toolRef?.current?.clientHeight || 20;
    let toolsLeft = left - containerLeft + width;

    // 工具top的位置
    let toolsTop = top - containerTop + container.scrollTop;

    // 如果工具组件的高度超过了容器的高度，那么就将工具组件的位置向下移动到组件的下方
    if (toolsTop < toolHeight) {
      toolsTop = toolsTop + height + 24;
    }
    if (toolsTop <= 0) {
      toolsTop -= -30;
      toolsLeft -= 10;
    }

    // 计算位置
    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft,
      width,
      height,
      toolsTop: toolsTop,
      toolsLeft: toolsLeft,
      rootToolsTop: top - containerTop + container.scrollTop + 32,
      rootToolsLeft: width - 16,
    });
  }

  const deleteHandle = () => {
    deleteComponent(componentId);
    setCurComponentId(null);
  };

  const maskContainer = document.querySelector(`.${containerClassName}`);

  // @ts-ignore
  function MaskTag({ children }) {
    return (
      <div className="flex items-center justify-center px-[4px] h-[20px] bg-[var(--edit-primary-color)] whitespace-nowrap">
        {children}
      </div>
    );
  }

  if (maskContainer) {
    return createPortal(
      <>
        <div
          className="absolute border-x-2 border-y-2 border-solid border-[var(--edit-primary-color)] pointer-events-none z-[1003] rounded-[4px] box-border"
          style={{
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height,
          }}
        />
        {isRoot && (
          <div
            className="absolute text-white text-[12px] z-11 -translate-x-full -translate-y-full"
            style={{
              left: position.rootToolsLeft,
              top: position.rootToolsTop,
            }}
          >
            <MaskTag>{desc}</MaskTag>
          </div>
        )}
        <div
          ref={toolRef}
          style={{
            position: "absolute",
            left: position.toolsLeft,
            top: position.toolsTop,
            fontSize: "14px",
            zIndex: 11,
            display: !position.width || position.width < 10 ? "none" : "inline",
            transform: "translate(-100%, -110%)",
          }}
        >
          {!isRoot && (
            <div className="flex items-center justify-center gap-[5px]">
              <MaskTag>
                <div className="cursor-pointer" onClick={deleteHandle}>
                  <DeleteOutlined style={{ color: "#fff" }} />
                </div>
              </MaskTag>
            </div>
          )}
        </div>
      </>,
      maskContainer!
    );
  }

  return null;
}

export default forwardRef(SelectedMask);

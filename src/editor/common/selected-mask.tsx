import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

import { useComponents } from "@editor/stores";

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
  const { curComponentId, deleteComponent, setCurComponentId } =
    useComponents();

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    toolsTop: 0,
    toolsLeft: 0,
  });

  // 对外暴露更新位置方法
  useImperativeHandle(ref, () => ({
    updatePosition,
  }));

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

    // console.log(top - containerTop + container.scrollTop, left - containerLeft);

    let toolsTop = top - containerTop + container.scrollTop;
    let toolsLeft = left - containerLeft + width;

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
      toolsTop,
      toolsLeft,
    });
  }

  const deleteHandle = () => {
    deleteComponent(componentId);
    setCurComponentId(null);
  };

  const maskContainer = document.querySelector(`.${containerClassName}`);

  if (maskContainer) {
    return createPortal(
      <>
        <div
          style={{
            position: "absolute",
            left: position.left,
            top: position.top,
            backgroundColor: "rgba(66, 133, 244, 0.2)",
            border: "1px solid rgb(66, 133, 244)",
            pointerEvents: "none",
            width: position.width,
            height: position.height,
            zIndex: 1003,
            borderRadius: 4,
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: position.toolsLeft,
            top: position.toolsTop,
            fontSize: "14px",
            color: "#ff4d4f",
            zIndex: 11,
            display: !position.width || position.width < 10 ? "none" : "inline",
            transform: "translate(-100%, -100%)",
          }}
        >
          {+(curComponentId || 0) !== 1 && (
            <div style={{ padding: "0 8px", backgroundColor: "#1890ff" }}>
              <Popconfirm
                title="确认删除该组件吗？"
                overlayClassName="min-w-130px"
                okText={
                  <div
                    className="delete-confirm-btn"
                    style={{ padding: "0 7px" }}
                  >
                    确认
                  </div>
                }
                cancelText={
                  <div
                    className="delete-confirm-btn"
                    style={{ padding: "0 7px" }}
                  >
                    取消
                  </div>
                }
                onConfirm={deleteHandle}
                // getPopupContainer={n => n.parentNode}
                placement="bottomRight"
                okButtonProps={{ style: { padding: 0 } }}
                cancelButtonProps={{ style: { padding: 0 } }}
              >
                <DeleteOutlined style={{ color: "#fff" }} />
              </Popconfirm>
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

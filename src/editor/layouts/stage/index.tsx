import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import Space from "@editor/components/space";
import { ItemType } from "@/editor/item-type";
import { Component } from "@editor/interface";
import { useDrop } from "react-dnd";
import { useComponents } from "@editor/stores";
import SelectedMask from "@/editor/common/selected-mask";
import HoverMask from "@editor/common/hover-mask";

const ComponentMap: { [key: string]: any } = {
  Button: Button,
  Space: Space,
};

const Stage: React.FC = () => {
  const { components, setCurComponentId, curComponentId } = useComponents();
  const containerClassName = "select-mask-container";
  const selectedMaskRef = useRef<any>(null);
  const [hoverComponentId, setHoverComponentId] = useState();

  // 组件改变后，重新渲染遮罩
  useEffect(() => {
    if (selectedMaskRef?.current) {
      selectedMaskRef.current.updatePosition();
    }
  }, [components]);

  useEffect(() => {
    const createMask = (e: any) => {
      e.preventDefault();
      // 获取当前点击的元素
      const path = e.composedPath();
      // 遍历path，找到最近的组件元素
      for (let i = 0; i < path.length; i++) {
        const el = path[i];
        if (el.getAttribute) {
          if (el.getAttribute("data-component-id")) {
            const componentId = el.getAttribute("data-component-id");
            setCurComponentId(componentId);
            setHoverComponentId(undefined);
            return;
          }
        }
      }
    };
    let container = document.querySelector("#stage-container");
    if (container) {
      container.addEventListener("click", createMask, true);
    }
    return () => {
      container = document.querySelector("#stage-container");
      if (container) {
        container.removeEventListener("click", createMask, true);
      }
    };
  }, []);

  useEffect(() => {
    function createMask(e: any) {
      // 获取当前点击的元素
      const path = e.composedPath();

      for (let i = 0; i < path.length; i += 1) {
        const ele = path[i];
        if (ele.getAttribute && ele.getAttribute("data-component-id")) {
          const componentId = ele.getAttribute("data-component-id");
          if (componentId) {
            if (curComponentId === componentId) {
              setHoverComponentId(undefined);
            } else {
              setHoverComponentId(componentId);
            }
            return;
          }
        }
      }
    }

    function removerMask() {
      setHoverComponentId(undefined);
    }

    let container = document.querySelector("#stage-container");

    if (container) {
      container.addEventListener("mouseover", createMask, true);
      container.addEventListener("mouseleave", removerMask);
    }
    return () => {
      container = document.querySelector(".stage");
      if (container) {
        container.removeEventListener("mouseover", createMask, true);
        container.removeEventListener("mouseleave", removerMask);
      }
    };
  }, [curComponentId]);

  // 渲染组件
  const renderComponents = (components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      // 组件不存在，返回 null
      if (!ComponentMap[component.name]) {
        return null;
      }

      return React.createElement(
        ComponentMap[component.name],
        {
          key: component.id,
          _id: component.id,
          _name: component.name,
          "data-component-id": component.id,
          ...component.props,
        },
        component.props.children || renderComponents(component.children || [])
      );
    });
  };

  // 如果拖拽的组件是可以放置的，canDrop则为true，通过这个可以给组件添加边框
  const [{ canDrop }, drop] = useDrop({
    // 可以接受的元素类型
    accept: [ItemType.Space, ItemType.Button],
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{ border: canDrop ? "1px solid #ccc" : "none" }}
      className="p-[24px] h-full"
      id="stage-container"
    >
      {renderComponents(components)}
      {curComponentId && (
        <SelectedMask
          componentId={curComponentId}
          containerClassName={containerClassName}
          offsetContainerIdName={"stage-container"}
          ref={selectedMaskRef}
        />
      )}
      {hoverComponentId && (
        <HoverMask
          containerClassName={containerClassName}
          offsetContainerIdName={"stage-container"}
          ref={selectedMaskRef}
          componentId={hoverComponentId}
        />
      )}
      <div className={containerClassName} />
    </div>
  );
};

export default Stage;

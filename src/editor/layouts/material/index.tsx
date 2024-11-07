import React, { useMemo } from "react";
import ComponentItem from "@/editor/common/component-item";
import { ComponentConfig, ComType } from "@/editor/interface";
import { useComponents, useComponentConfigStore } from "@editor/stores";

const Material: React.FC = () => {
  const { addComponent } = useComponents();
  const { componentConfig } = useComponentConfigStore();

  // 拖拽结束时触发的回调
  const onDragEnd = (dropResult: {
    name: string;
    id?: string;
    desc: string;
    props: any;
    type: ComType;
  }) => {
    addComponent(
      {
        id: String(new Date().getTime()),
        name: dropResult.name,
        props: dropResult.props,
        type: dropResult.type,
      },
      dropResult.id
    );
  };

  const components = useMemo(() => {
    // 加载所有组件
    const coms = Object.values(componentConfig).map(
      (config: ComponentConfig) => {
        return {
          name: config.name,
          description: config.desc,
          icon: config.icon,
          comType: config.comType,
        };
      }
    );
    return coms;
  }, [componentConfig]);

  return (
    <div className="flex p-[10px] gap-4 flex-wrap">
      {components.map((item) => (
        <ComponentItem key={item.name} onDragEnd={onDragEnd} {...item} />
      ))}
    </div>
  );
};

export default Material;

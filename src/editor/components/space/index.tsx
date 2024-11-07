import React from "react";
import { Space as AntdSpace } from "antd";
import { useDrop } from "@/editor/hooks";
import { CommonComponentProps } from "@editor/interface";

const Space: React.FC<CommonComponentProps> = (props) => {
  const { children, _id, _name } = props;
  const { drop, canDrop } = useDrop(_id, _name);

  return (
    <AntdSpace
      ref={drop}
      className="p-[16px]"
      style={{ border: canDrop ? "1px solid #ccc" : "none" }}
      data-component-id={_id}
    >
      {children.length > 0 ? children : "请拖拽组件"}
    </AntdSpace>
  );
};

export default Space;

import { CommonComponentProps } from "@editor/interface";

import { Button as AntdButton } from "antd";

const Button = ({ _id, type, text }: CommonComponentProps) => {
  return (
    <AntdButton data-component-id={_id} type={type}>
      {text || "测试按钮文字"}
    </AntdButton>
  );
};

export default Button;

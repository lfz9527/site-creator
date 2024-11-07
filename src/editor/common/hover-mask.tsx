import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Dropdown, Popconfirm, Space } from "antd";
import { createPortal } from "react-dom";
import { useComponetsStore } from "@editor/stores";

interface Props {
  // 容器class
  containerClassName: string;
  // 相对容器class
  offsetContainerClassName: string;
}

const SelectedMask = (
  { containerClassName, offsetContainerClassName }: Props,
  ref: any
) => {
  return <>123</>;
};

export default SelectedMask;

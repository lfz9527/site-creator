export interface Context {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export type ComType = "static" | "iframe";

export interface Component {
  /**
   * 组件唯一标识
   */
  id: string;
  /**
   * 组件名称
   */
  name: string;
  /**
   * 组件类型
   */
  type: ComType;
  /**
   * 组件属性
   */
  props: any;
  /**
   * 组件样式
   */
  style?: any;
  /**
   * 子组件
   */
  children?: Component[];
  /**
   * 父组件id
   */
  parentId?: string;
}

export interface CommonComponentProps {
  _id: string;
  _name: string;
  _desc?: string;
  children?: any;
  [key: string]: any;
}

export interface ComponentConfig {
  /**
   * 组件名称
   */
  name: string;
  /**
   * 组件描述
   */
  desc: string;
  /**
   * 组件图标
   */
  icon?: string;
  /**
   * 允许放置到哪些组件上
   */
  allowDrag: string[];
  /**
   * 对应组件
   */
  component: any;
  /**
   * 组件类型
   */
  comType: ComType;
}

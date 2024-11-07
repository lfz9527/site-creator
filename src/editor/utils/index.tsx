import { Component } from "@editor/interface";
import { useComponentConfigStore } from "@editor/stores";
/**
 * 根据id递归查找组件
 * @param id 组件id
 * @param components 组件列表
 * @returns Component | null
 */
export function getComponentById(
  id: string | null,
  components: Component[]
): Component | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * 获取组件允许拖入的组件
 * @param componentName 组件名
 * @returns
 */
export const getAcceptDrop = (componentName: string) => {
  const { componentConfig } = useComponentConfigStore.getState();

  return (
    Object.values(componentConfig)
      .filter((o) => o.allowDrag?.includes(componentName))
      .map((o) => o.name) || []
  );
};

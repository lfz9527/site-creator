import { Component } from "@editor/interface";
/**
 * 根据id递归查找组件
 * @param id 组件id
 * @param components 组件列表
 * @returns Component | null
 */
export function getComponentById(
  id:string | null,
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

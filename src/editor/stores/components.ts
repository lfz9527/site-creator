import { create } from "zustand";
import { Component } from "@editor/interface";
import { logger } from "./loggerMiddleware";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { getComponentById } from "@editor/utils";

interface State {
  components: Component[];
  curComponentId?: string | null;
  curComponent: Component | null;
}

interface Action {
  /**
   * 添加组件
   * @param component 组件属性
   * @param parentId 父组件id
   * @returns
   */
  addComponent: (component: Component, parentId?: string) => void;
  /**
   * 设置当前组件Id
   * @param componentId 当前组件id
   * @returns
   */
  setCurComponentId: (componentId: string | null) => void;
}

const useComponents = create<State & Action>()(
  logger(
    devtools(
      persist(
        (set) => ({
          curComponent: null,
          components: [],
          addComponent: (component, parentId) =>
            set((state) => {
              // 如果有父组件id, 则添加到父组件的子组件中
              if (parentId) {
                const parentComponent = getComponentById(
                  parentId,
                  state.components
                );
                console.log("parentComponent", parentComponent);
                if (parentComponent) {
                  if (parentComponent?.children) {
                    parentComponent?.children?.push(component);
                  } else {
                    parentComponent.children = [component];
                  }
                  return { components: [...state.components] };
                }
              }
              return { components: [...state.components, component] };
            }),
          setCurComponentId: (componentId) =>
            set((state) => ({
              curComponentId: componentId,
              curComponent: getComponentById(componentId, state.components),
            })),
        }),
        {
          name: "useComponents",
          storage: createJSONStorage(() => localStorage),
        }
      ),
      { name: "globalState" }
    )
  )
);
export default useComponents;

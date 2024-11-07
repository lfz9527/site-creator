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

  /**
   * 删除组件
   * @param componentId
   * @returns
   */
  deleteComponent: (componentId: string) => boolean;
}

const useComponents = create<State & Action>()(
  logger(
    devtools(
      persist(
        (set, get) => ({
          curComponent: null,
          components: [
            // {
            //   id: '1',
            //   name: 'Page',
            //   props: {},
            //   desc: '页面',
            // },
          ],
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
                }
                component.parentId = parentId;
                return { components: [...state.components] };
              }
              return { components: [...state.components, component] };
            }),
          setCurComponentId: (componentId) =>
            set((state) => ({
              curComponentId: componentId,
              curComponent: getComponentById(componentId, state.components),
            })),
          deleteComponent: (componentId) => {
            if (!componentId) return false;
            const component = getComponentById(componentId, get().components);
            if (component?.parentId) {
              const parentComponent = getComponentById(
                component.parentId,
                get().components
              );
              if (parentComponent) {
                parentComponent.children = parentComponent?.children?.filter(
                  (item) => item.id !== componentId
                );
                set({ components: [...get().components] });
              }
            } else {
              set({
                components: [
                  ...get().components.filter((v) => v.id !== componentId),
                ],
              });
            }
            return true;
          },
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

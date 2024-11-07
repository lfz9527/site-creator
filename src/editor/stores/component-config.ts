import {create} from 'zustand';
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { logger } from "./loggerMiddleware";
import {ComponentConfig} from '@editor/interface';

interface State {
  componentConfig: {[key: string]: ComponentConfig}; // 组件配置
}

interface Action {
  setComponentConfig: (componentConfig: State['componentConfig']) => void;
}

 const useComponentConfigStore = create<State & Action>()(
  logger(
    devtools(
      persist(
        (set) => ({
          componentConfig: {},
          setComponentConfig: (componentConfig) => set({componentConfig}),
        }),
        {
          name: "useComponentConfigStore",
          storage: createJSONStorage(() => localStorage),
        }
      ),
      { name: "globalState" }
      )
    )
  )

export default useComponentConfigStore;
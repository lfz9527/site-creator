import {create} from 'zustand'
import {persist, createJSONStorage, devtools} from 'zustand/middleware'
import {logger} from './loggerMiddleware'

interface State {
    width: number | string // 画板宽度
}

interface Action {
    setStageWidth: (width: State['width']) => void
}

const useComponentConfigStore = create<State & Action>()(
    logger(
        devtools(
            persist(
                (set) => ({
                    width: 0,
                    setStageWidth: (width) => set({width})
                }),
                {
                    name: 'useStageConfig',
                    storage: createJSONStorage(() => localStorage)
                }
            ),
            {name: 'useStageConfig'}
        )
    )
)

export default useComponentConfigStore

import {create} from 'zustand'
import {Component} from '@editor/interface'
import {logger} from './loggerMiddleware'
import {persist, createJSONStorage, devtools} from 'zustand/middleware'
import {getComponentById, delComponentById} from '@editor/utils'

interface State {
    components: Component[]
    curComponentId?: string | null
    curComponent: Component | null
}

interface Action {
    /**
     * 初始化画布
     * @returns
     */
    initPage: () => void
    /**
     * 添加组件
     * @param component 组件属性
     * @param parentId 父组件id
     * @returns
     */
    addComponent: (component: Component, parentId?: string) => void
    /**
     * 设置当前组件Id
     * @param componentId 当前组件id
     * @returns
     */
    setCurComponentId: (componentId: string | null) => void

    /**
     * 删除组件
     * @param componentId
     * @returns
     */
    deleteComponent: (componentId: string) => boolean
    /**
     * 插入组件
     * @param targetId 目标组件id
     * @param curComponentId 需要移动的组件id
     * @returns
     */
    insertComponent: (targetId: string, curComponentId: string) => boolean
}

const useComponents = create<State & Action>()(
    logger(
        devtools(
            persist(
                (set, get) => ({
                    curComponent: null,
                    components: [],
                    addComponent: (component, parentId) =>
                        set((state) => {
                            // 如果有父组件id, 则添加到父组件的子组件中
                            if (parentId) {
                                const parentComponent = getComponentById(
                                    parentId,
                                    state.components
                                )
                                if (parentComponent) {
                                    if (parentComponent?.children) {
                                        parentComponent?.children?.push(
                                            component
                                        )
                                    } else {
                                        parentComponent.children = [component]
                                    }
                                }
                                component.parentId = parentId
                                return {components: [...state.components]}
                            }
                            return {
                                components: [...state.components, component]
                            }
                        }),
                    setCurComponentId: (componentId) =>
                        set((state) => ({
                            curComponentId: componentId,
                            curComponent: getComponentById(
                                componentId,
                                state.components
                            )
                        })),
                    deleteComponent: (componentId) => {
                        if (!componentId) return false
                        const component = getComponentById(
                            componentId,
                            get().components
                        )
                        if (component?.parentId) {
                            const parentComponent = getComponentById(
                                component.parentId,
                                get().components
                            )
                            if (parentComponent) {
                                parentComponent.children =
                                    parentComponent?.children?.filter(
                                        (item) => item.id !== componentId
                                    )
                                set({components: [...get().components]})
                            }
                        } else {
                            set({
                                components: [
                                    ...get().components.filter(
                                        (v) => v.id !== componentId
                                    )
                                ]
                            })
                        }
                        return true
                    },
                    insertComponent: (targetId, curComponentId) => {
                        let bool = true
                        set((state) => {
                            const components = JSON.parse(
                                JSON.stringify(get().components)
                            )
                            // 找到目标节点和源节点
                            const target = getComponentById(
                                targetId,
                                components
                            )
                            const toMoveCom = getComponentById(
                                curComponentId,
                                components
                            )

                            // 如果目标节点和源节点是同一个节点，则不移动
                            const noMove = toMoveCom?.parentId === targetId
                            if (noMove) return {components}

                            if (!target || !toMoveCom) {
                                bool = false
                                return {components}
                            }

                            console.log(targetId, curComponentId)

                            // 删除源节点
                            delComponentById(components, curComponentId)

                            // 将源节点添加到目标节点的 children 中
                            if (!target.children) {
                                target.children = []
                            }
                            toMoveCom.parentId = targetId
                            target.children.push(toMoveCom)

                            return {
                                components: state.components
                            }
                        })
                        return bool
                    },
                    initPage() {
                        set(() => ({
                            components: [],
                            curComponentId: null,
                            curComponent: null
                        }))
                    }
                }),
                {
                    name: 'useComponents',
                    storage: createJSONStorage(() => localStorage)
                }
            ),
            {name: 'useComponents'}
        )
    )
)
export default useComponents

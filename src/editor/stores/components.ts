import {create} from 'zustand'
import {Component} from '@editor/interface'
import {logger} from './loggerMiddleware'
import {persist, createJSONStorage, devtools} from 'zustand/middleware'
import {
    getComponentById,
    findNodeAndParent
    // delComponentById
} from '@editor/utils'

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
    insertComponent: (
        targetId: string,
        curComponentId: string,
        moveType?: dropZoneType | null
    ) => boolean
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
                    insertComponent: (targetId, curComponentId, moveType) => {
                        let bool = true
                        set(() => {
                            const components = JSON.parse(
                                JSON.stringify(get().components)
                            )

                            console.log('移动到目标节点id', targetId)
                            console.log('被移动的节点id', curComponentId)

                            // 如果目标节点和源节点是同一个节点，则不移动
                            if (curComponentId === targetId) return {components}

                            // 查找目标节点和父节点
                            const {curCom, curParentCom} = findNodeAndParent(
                                curComponentId,
                                components
                            )

                            if (!curCom) {
                                bool = false
                                return {
                                    components
                                }
                            }

                            // 查找新父节点
                            const {
                                curCom: targetCom,
                                curParentCom: targetParentCom
                            } = findNodeAndParent(targetId, components)

                            if (!targetCom) {
                                bool = false
                                return {
                                    components
                                }
                            }

                            // 删除旧父节点中的目标节点
                            // @ts-ignore
                            const curIndex = curParentCom.children.findIndex(
                                (child) => child.id === curComponentId
                            )
                            if (curIndex !== -1) {
                                // @ts-ignore
                                curParentCom.children.splice(curIndex, 1)
                            }
                            console.log('targetCom', targetCom)
                            console.log('targetParentCom', targetParentCom)

                            console.log('moveType', moveType)

                            if (moveType === 'horizontal') {
                                // 行移动
                                curCom.parentId = targetParentCom.id

                                if (!targetParentCom.children) {
                                    targetParentCom.children = []
                                }
                                const targetIndex =
                                    targetParentCom.children.findIndex(
                                        (child) => child.id === targetId
                                    )

                                if (targetIndex === -1) {
                                    targetParentCom.children.push(curCom)
                                } else {
                                    targetParentCom.children.splice(
                                        targetIndex,
                                        0,
                                        curCom
                                    )
                                }
                            } else if (moveType === 'vertical') {
                                // 列移动
                            } else {
                                // 层级嵌套
                                curCom.parentId = targetCom.id
                                if (!targetCom.children) {
                                    targetCom.children = []
                                }
                                targetCom.children.push(curCom)
                            }
                            return {
                                components
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
                    storage: createJSONStorage(() => sessionStorage)
                }
            ),
            {name: 'useComponents'}
        )
    )
)
export default useComponents

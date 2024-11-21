import {Component} from '@editor/interface'
import {useComponentConfigStore, useComponents} from '@editor/stores'
import {ItemType} from '@editor/item-type'
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
            return component
        }
        if (component.children && component.children.length > 0) {
            const result = getComponentById(id, component.children)
            if (result) {
                return result
            }
        }
    }
    return null
}
/**
 * 删除指定节点
 * @param components
 * @param nodeId
 * @returns
 */
export const delComponentById = (
    components: Component[],
    id: string
): boolean => {
    for (let i = 0; i < components.length; i++) {
        const component = components[i]
        if (component.id === id) {
            components.splice(i, 1) // 从数组中移除该节点
            return true
        } else if (component.children && component.children.length > 0) {
            const deleted = delComponentById(component.children, id)
            if (deleted) return true
        }
    }
    return false
}

/**
 * 查找指定ID的节点及其父节点
 * @param id
 * @param components
 */
export const findNodeAndParent = (
    id: string,
    components: Component[]
): {
    curCom: Component
    curParentCom: Component
} => {
    // 找不到父组件，就返回根组件
    let result = {
        curCom: components[0],
        curParentCom: components[0]
    }
    const traverse = (nodes: Component[], parent = components[0]) => {
        for (const node of nodes) {
            if (node.id === id) {
                result = {curCom: node, curParentCom: parent}
                return
            }
            if (node && node.children && node.children.length > 0) {
                traverse(node.children, node)
            }
        }
    }

    traverse(components)

    return result
}

/**
 * 获取组件允许拖入的组件
 * @param componentName 组件名
 * @returns
 */
export const getAcceptDrop = (componentName: string) => {
    const {componentConfig} = useComponentConfigStore.getState()

    return (
        Object.values(componentConfig)
            .filter((o) => o.allowDrag?.includes(componentName))
            .map((o) => o.name) || []
    )
}

type observeContainerType = (
    cb: (container: HTMLElement, entries?: ResizeObserverEntry[]) => void,
    option: observeOpt
) => {
    resizeObserver: ResizeObserver
    container: HTMLElement
}

/**
 * 监听容器尺寸变化
 * @param cb 回调函数
 * @param option 配置
 * @returns
 */
export const observeContainer: observeContainerType = (cb, option) => {
    const {containerId, containerClassName, dataComponentId, htmlStr} = option

    const names = [
        containerId && `#${containerId}`,
        containerClassName && `.${containerClassName}`,
        dataComponentId && `[data-component-id="${dataComponentId}"]`
    ]
        .filter(Boolean)
        .join(',')
    const container = htmlStr
        ? htmlStr
        : (document.querySelector(names!) as HTMLElement)
    const resizeObserver = new ResizeObserver((entries) => {
        cb && cb(container, entries)
    })
    if (container) resizeObserver.observe(container)

    return {resizeObserver, container}
}

/**
 * 初始化舞台
 */
export const initStage = () => {
    const {componentConfig} = useComponentConfigStore.getState()
    const {addComponent, initPage} = useComponents.getState()
    initPage()
    const Page = componentConfig[ItemType.Page]
    const options = {
        id: String(new Date().getTime()),
        name: Page.name,
        props: Page.defaultProps || [],
        type: Page.comType,
        description: Page.description
    }
    addComponent(options)
}

import {stageContainerId, stageComLayoutId} from '@editor/enum'

export const getNode = (componentId: string): HTMLElement | null =>
    document.querySelector(`[data-component-id="${componentId}"]`)

export const getContainer = (id: string): HTMLElement | null =>
    document.getElementById(id)

type CheckValidResult = (componentId: string) =>
    | {
          [key: string]: HTMLElement
      }
    | false
export const checkValid: CheckValidResult = (componentId) => {
    if (!componentId) return false
    const container = getContainer(stageContainerId)
    if (!container) return false
    const node = getNode(componentId)
    if (!node) return false
    const comLayout = getContainer(stageComLayoutId)
    if (!comLayout) return false

    return {
        node,
        container,
        comLayout
    }
}

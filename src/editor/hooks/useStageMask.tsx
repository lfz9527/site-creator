import {useState, useEffect, useRef} from 'react'
import {stageContainerId} from '@editor/enum'
import {useComponents} from '@editor/stores'

const attribute = 'data-component-id'

const containerClassName = 'select-mask-container'

const getStageDom = () => document.getElementById(stageContainerId)

interface CustomHTMLDivElement extends HTMLDivElement {
    updatePosition: () => void
}

const useStageMask = (maskRef: React.RefObject<CustomHTMLDivElement>) => {
    const {setCurComponentId, curComponentId, components} = useComponents()
    const [hoverComponentId, setHoverComponentId] = useState()
    const maskContainerRef = useRef<HTMLDivElement>(null)
    const maskDiv = () => (
        <div ref={maskContainerRef} className={containerClassName} />
    )

    // 点击事件遮罩
    useEffect(() => {
        const createClickMask = (e: any) => {
            e.preventDefault()
            // 获取当前点击的元素
            const path = e.composedPath()
            // 遍历path，找到最近的组件元素
            for (let i = 0; i < path.length; i++) {
                const el = path[i]
                if (el.getAttribute) {
                    if (el.getAttribute(attribute)) {
                        const componentId = el.getAttribute(attribute)
                        setCurComponentId(componentId)
                        setHoverComponentId(undefined)
                        return
                    }
                }
            }
        }
        let container = getStageDom()
        if (container) {
            container.addEventListener('click', createClickMask, true)
        }
        return () => {
            container = getStageDom()
            if (container) {
                container.removeEventListener('click', createClickMask, true)
            }
        }
    }, [])

    // hover 事件遮罩
    useEffect(() => {
        const createHoverMask = (e: any) => {
            // 获取当前点击的元素
            const path = e.composedPath()

            for (let i = 0; i < path.length; i += 1) {
                const ele = path[i]
                if (ele.getAttribute && ele.getAttribute(attribute)) {
                    const componentId = ele.getAttribute(attribute)
                    if (componentId) {
                        if (curComponentId === componentId) {
                            setHoverComponentId(undefined)
                        } else {
                            setHoverComponentId(componentId)
                        }
                        return
                    }
                }
            }
        }
        const removerMask = () => {
            setHoverComponentId(undefined)
        }

        let container = getStageDom()

        if (container) {
            container.addEventListener('mouseleave', removerMask)
            container.addEventListener('mouseover', createHoverMask, true)
        }
        return () => {
            container = getStageDom()
            if (container) {
                container.removeEventListener(
                    'mouseover',
                    createHoverMask,
                    true
                )
                container.removeEventListener('mouseleave', removerMask)
            }
        }
    }, [curComponentId])

    // 组件改变后，重新渲染遮罩
    useEffect(() => {
        if (maskRef?.current) {
            maskRef.current.updatePosition()
        }
    }, [components])

    return {
        hoverComponentId,
        containerClassName,
        maskContainerRef,
        maskDiv
    }
}

export default useStageMask

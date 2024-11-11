import React, {useEffect, useRef, useState} from 'react'
import {Component} from '@editor/interface'
import {
    useComponents,
    useComponentConfigStore,
    useStageConfig
} from '@editor/stores'
import SelectedMask from '@/editor/common/selected-mask'
import HoverMask from '@editor/common/hover-mask'

const Stage: React.FC = () => {
    const {components, setCurComponentId, curComponentId} = useComponents()
    const {componentConfig} = useComponentConfigStore()
    const {setStageWidth} = useStageConfig()
    const containerClassName = 'select-mask-container'
    const iframeId = 'stage-container'
    const selectedMaskRef = useRef<any>(null)
    const [hoverComponentId, setHoverComponentId] = useState()
    const iframeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setStageWidth(iframeRef.current?.offsetWidth || '100%')
    }, [])

    // 组件改变后，重新渲染遮罩
    useEffect(() => {
        if (selectedMaskRef?.current) {
            selectedMaskRef.current.updatePosition()
        }
    }, [components])

    useEffect(() => {
        const createMask = (e: any) => {
            e.preventDefault()
            // 获取当前点击的元素
            const path = e.composedPath()
            // 遍历path，找到最近的组件元素
            for (let i = 0; i < path.length; i++) {
                const el = path[i]
                if (el.getAttribute) {
                    if (el.getAttribute('data-component-id')) {
                        const componentId = el.getAttribute('data-component-id')
                        setCurComponentId(componentId)
                        setHoverComponentId(undefined)
                        return
                    }
                }
            }
        }
        let container = document.querySelector('#stage-container')
        if (container) {
            container.addEventListener('click', createMask, true)
        }
        return () => {
            container = document.querySelector('#stage-container')
            if (container) {
                container.removeEventListener('click', createMask, true)
            }
        }
    }, [])

    useEffect(() => {
        function createMask(e: any) {
            // 获取当前点击的元素
            const path = e.composedPath()

            for (let i = 0; i < path.length; i += 1) {
                const ele = path[i]
                if (ele.getAttribute && ele.getAttribute('data-component-id')) {
                    const componentId = ele.getAttribute('data-component-id')
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

        function removerMask() {
            setHoverComponentId(undefined)
        }

        let container = document.querySelector('#stage-container')

        if (container) {
            container.addEventListener('mouseover', createMask, true)
            container.addEventListener('mouseleave', removerMask)
        }
        return () => {
            container = document.querySelector('#stage-container')
            if (container) {
                container.removeEventListener('mouseover', createMask, true)
                container.removeEventListener('mouseleave', removerMask)
            }
        }
    }, [curComponentId])

    // 渲染组件
    const renderComponents = (components: Component[]): React.ReactNode => {
        return components.map((component: Component) => {
            // 组件不存在，返回 null
            if (!componentConfig[component.name]) {
                return null
            }

            return React.createElement(
                componentConfig[component.name].component,
                {
                    key: component.id,
                    _id: component.id,
                    _name: component.name,
                    'data-component-id': component.id,
                    ...component.props
                },
                component.props.children ||
                    renderComponents(component.children || [])
            )
        })
    }
    return (
        <div
            ref={iframeRef}
            className='relative h-full bg-white'
            id={iframeId}
            style={{
                width: '100%',
                transition: 'width 0.3s ease-in-out' // 添加过渡效果
            }}
        >
            {renderComponents(components)}
            {curComponentId && (
                <SelectedMask
                    componentId={curComponentId}
                    containerClassName={containerClassName}
                    offsetContainerIdName={iframeId}
                    ref={selectedMaskRef}
                />
            )}
            {hoverComponentId && (
                <HoverMask
                    containerClassName={containerClassName}
                    offsetContainerIdName={iframeId}
                    ref={selectedMaskRef}
                    componentId={hoverComponentId}
                />
            )}
            <div className={containerClassName} />
        </div>
    )
}

export default Stage

import React, {useEffect, useRef, useState} from 'react'
import {Component} from '@editor/interface'
import {
    useComponents,
    useComponentConfigStore,
    useStageConfig
} from '@editor/stores'
import SelectedMask from '@/editor/common/selected-mask'
import HoverMask from '@editor/common/hover-mask'
import {defaultProps} from '@/editor/interface'

const Stage: React.FC = () => {
    const {components, setCurComponentId, curComponentId} = useComponents()
    const {componentConfig} = useComponentConfigStore()
    const {setStageWidth} = useStageConfig()
    const containerClassName = 'select-mask-container'
    const iframeId = 'stage-container'
    const selectedMaskRef = useRef<any>(null)
    const [hoverComponentId, setHoverComponentId] = useState()
    const iframeRef = useRef<HTMLDivElement>(null)
    const [iframeHeight, setIframeHeight] = useState(0)

    useEffect(() => {
        setStageWidth(iframeRef.current?.offsetWidth || '100%')
        heightChange()
        window.addEventListener('resize', () => {
            heightChange()
        })

        return () => {
            window.removeEventListener('resize', () => {
                heightChange()
            })
        }
    }, [])

    // 高度改变时，更新 iframe 高度
    const heightChange = () => {
        const iframeWrap = iframeRef.current?.parentElement as HTMLElement
        const iframeWrapHeight = iframeWrap.offsetHeight - 33
        setIframeHeight(iframeWrapHeight || 0)
    }

    // 组件改变后，重新渲染遮罩
    useEffect(() => {
        if (selectedMaskRef?.current) {
            selectedMaskRef.current.updatePosition()
        }
    }, [components])

    // 创建遮罩
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

    // 创建 hover 遮罩
    useEffect(() => {
        function createMask(e: any) {
            // 获取当前点击的元素
            const path = e.composedPath()

            for (let i = 0; i < path.length; i += 1) {
                const ele = path[i]
                if (ele.getAttribute && ele.getAttribute('data-component-id')) {
                    const componentId = ele.getAttribute('data-component-id')
                    console.log('componentId', componentId)
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
            container.addEventListener('mouseleave', removerMask)
            container.addEventListener('mouseover', createMask, true)
        }
        return () => {
            container = document.querySelector('#stage-container')
            if (container) {
                container.removeEventListener('mouseover', createMask, true)
                container.removeEventListener('mouseleave', removerMask)
            }
        }
    }, [curComponentId])

    // 格式化组件 props
    const formatProps = (component: Component) => {
        const props: {
            [key: string]: any
        } = {}
        component?.props.forEach((item: defaultProps) => {
            const {key, value} = item
            props[key] = value
        })
        return props
    }

    // 渲染组件
    const renderComponents = (components: Component[]): React.ReactNode => {
        return components.map((component: Component) => {
            // 组件不存在，返回 null
            if (!componentConfig[component.name]) {
                return null
            }
            const props = formatProps(component)

            return React.createElement(
                componentConfig[component.name].component,
                {
                    key: component.id,
                    _id: component.id,
                    _name: component.name,
                    'data-component-id': component.id,
                    ...props
                },
                renderComponents(component.children || [])
            )
        })
    }
    return (
        <div
            ref={iframeRef}
            className='relative'
            id={iframeId}
            style={{
                overflowY: 'auto',
                height: iframeHeight + 'px',
                width: '100%',
                backgroundColor: '#fff',
                transition: 'width 0.2s ease-in-out' // 添加过渡效果
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

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from 'react'
import {createPortal} from 'react-dom'
import {useComponentConfigStore, useComponents} from '@editor/stores'
import {getComponentById} from '@editor/utils'

interface Props {
    // 容器class
    containerClassName: string
    // 相对容器id
    offsetContainerIdName: string
    // 组件id
    componentId: string
}

function SelectedMask(
    {containerClassName, offsetContainerIdName, componentId}: Props,
    ref: any
) {
    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        toolsTop: 0,
        toolsLeft: 0
    })

    const maskContainer = document.querySelector(`.${containerClassName}`)!

    const {componentConfig} = useComponentConfigStore()
    const {components} = useComponents()

    const curComponent = useMemo(() => {
        return getComponentById(componentId, components)
    }, [componentId])

    const curComponentConfig = componentConfig[curComponent?.name || '']
    const {isRoot, description, name} = curComponentConfig

    // 对外暴露更新位置方法
    useImperativeHandle(ref, () => ({
        updatePosition
    }))

    useEffect(() => {
        updatePosition()
    }, [componentId])

    useEffect(() => {
        window.addEventListener('scroll', () => {
            updatePosition()
        })
        return () => {
            window.removeEventListener('scroll', () => {
                updatePosition()
            })
        }
    }, [componentId])

    const updatePosition = () => {
        if (!componentId) return

        const container = document.querySelector(`#${offsetContainerIdName}`)
        if (!container) return

        const node = document.querySelector(
            `[data-component-id="${componentId}"]`
        )

        if (!node) return

        // 获取节点位置
        const {top, left, width, height} = node.getBoundingClientRect()

        // 获取容器位置
        const {top: containerTop, left: containerLeft} =
            container.getBoundingClientRect()

        let toolsTop = top - containerTop + container.scrollTop
        const toolsLeft = left - containerLeft + width
        if (toolsTop <= 0) {
            toolsTop += height + 22
        }

        setPosition({
            top: top - containerTop + container.scrollTop,
            left: left - containerLeft,
            width,
            height,
            toolsTop: toolsTop,
            toolsLeft: toolsLeft
        })
    }

    return createPortal(
        <>
            <div
                className='absolute bg-red bg-[rgba(66, 133, 244, 0.04)] border-2 border-dashed border-[var(--edit-primary-color)] pointer-events-none z-[120] rounded-[4px] box-border'
                style={{
                    left: position.left,
                    top: position.top,
                    width: position.width,
                    height: position.height
                }}
            />
            <div
                className='absolute -translate-x-full -translate-y-full z-[120]'
                style={{
                    left: isRoot ? position.width - 16 : position.toolsLeft,
                    top: isRoot ? position.top + 36 : position.toolsTop,
                    display:
                        !position.width || position.width < 10
                            ? 'none'
                            : 'inline'
                }}
            >
                <span className='px-[4px] py-0 bg-[var(--edit-primary-color)] rounded-[2px] text-white text-xs  whitespace-nowrap'>
                    {description || name}
                </span>
            </div>
        </>,
        maskContainer!
    )
}

export default forwardRef(SelectedMask)

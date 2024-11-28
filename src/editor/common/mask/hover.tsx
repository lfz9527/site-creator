import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useMemo,
    useEffect
} from 'react'

import {createPortal} from 'react-dom'
import {useComponentConfigStore, useComponents} from '@editor/stores'
import {getComponentById} from '@editor/utils'
import {checkValid} from './utils'
import MaskTag from './mask-tag'

interface Props {
    // 组件id
    componentId: string
    // 容器的ref
    maskContainerRef: React.RefObject<HTMLDivElement>
}

const Hover = forwardRef<HTMLDivElement, Omit<Props, 'ref'>>((props, ref) => {
    const {componentId, maskContainerRef} = props
    const toolRef = useRef<HTMLDivElement>(null)
    const {componentConfig} = useComponentConfigStore()
    const {components} = useComponents()
    const [maskPos, setMaskPos] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0
    })
    const [ToolPos, setToolPos] = useState({
        left: 0,
        top: 0
    })

    // 获取当前组件
    const focusCom = useMemo(() => {
        return getComponentById(componentId, components)
    }, [componentId])

    const curComponentConfig = componentConfig[focusCom?.name || '']
    const {isRoot, description, name} = curComponentConfig

    // 对外暴露更新位置方法
    // @ts-ignore
    useImperativeHandle(ref, () => ({
        updatePosition
    }))

    useEffect(() => {
        updatePosition()
    }, [componentId])

    function updatePosition() {
        const valid = checkValid(componentId)
        if (!valid) return

        const {node, comLayout} = valid

        // 获取节点位置
        const {top, left, width, height} = node.getBoundingClientRect()
        // 获取容器位置
        const {top: cTop, left: cLeft} = comLayout.getBoundingClientRect()

        const realTop = top - cTop + comLayout.scrollTop

        const maskHeight = isRoot ? comLayout.scrollHeight : height

        const toolHeight = toolRef.current?.offsetHeight || 0

        setMaskPos({
            top: realTop,
            left: left - cLeft,
            width,
            height: maskHeight
        })

        const gap = 16
        const realNodeWidth = left - cLeft + width

        let tooTop = isRoot ? realTop + toolHeight + gap : realTop
        const tooLeft = isRoot ? realNodeWidth - gap : realNodeWidth

        // 默认显示在组件的下方
        // 超出容器高度，显示在组件下方
        if (tooTop <= 0) {
            tooTop += height + gap
        }

        setToolPos({
            top: tooTop,
            left: tooLeft
        })
    }

    return createPortal(
        <>
            <div
                className='absolute bg-[rgba(66,133,244,0.04)] border-[1px] border-dashed border-[var(--edit-primary-color)] pointer-events-none z-[120] rounded-[4px] box-border'
                style={maskPos}
            />
            <div
                ref={toolRef}
                className='absolute -translate-x-full -translate-y-full z-[120]'
                style={ToolPos}
            >
                <div className='flex items-center justify-center gap-[5px]'>
                    <MaskTag>{description || name}</MaskTag>
                </div>
            </div>
        </>,
        maskContainerRef.current!
    )
})

export default Hover

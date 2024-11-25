import {
    forwardRef,
    useImperativeHandle,
    useState,
    useMemo,
    useEffect,
    useRef
} from 'react'
import {createPortal} from 'react-dom'
import {useComponents, useComponentConfigStore} from '@editor/stores'
import {getComponentById} from '@editor/utils'
import {checkValid} from './utils'
import {useObserve, useResize, useDebounce} from '@editor/hooks'
import {DeleteOutlined} from '@ant-design/icons'
import MaskTag from './mask-tag'
import type {ComponentConfig} from '@/editor/interface'

interface Props {
    // 组件id
    componentId: string
    // 容器的ref
    maskContainerRef: React.RefObject<HTMLDivElement>
}

const SelectMask = forwardRef<HTMLDivElement, Omit<Props, 'ref'>>(
    (props, ref) => {
        const {componentId, maskContainerRef} = props
        const {componentConfig} = useComponentConfigStore()
        const [curComConfig, setCurComConfig] =
            useState<ComponentConfig | null>(null)
        const debouncedSetSearchTerm = useDebounce(updatePosition, 250)
        const {components, deleteComponent, setCurComponentId} = useComponents()
        const toolRef = useRef<HTMLDivElement>(null)
        const [maskPos, setMaskPos] = useState({
            left: 0,
            top: 0,
            width: 0,
            height: 0
        })
        const [rootToolPos, setRootToolPos] = useState({
            left: 0,
            top: 0
        })
        const [ToolPos, setToolPos] = useState<{
            top: number
            right?: number
            left?: number
        }>({
            top: 0
        })

        // 获取当前组件
        const focusCom = useMemo(() => {
            return getComponentById(componentId, components)
        }, [componentId])

        useEffect(() => {
            updatePosition()
        }, [componentId])

        useResize(() => {
            updatePosition()
        })

        useObserve(() => {
            debouncedSetSearchTerm()
        })
        function updatePosition() {
            const {isRoot, curComponentConfig} = getCurrentConfig()

            // debugger

            const valid = checkValid(componentId)
            if (!valid) return

            const {node, comLayout} = valid
            // 获取节点位置
            const {top, left, width, height, right} =
                node.getBoundingClientRect()

            // 获取容器位置
            const {
                top: cTop,
                left: cLeft,
                right: cRight
            } = comLayout.getBoundingClientRect()

            const {width: toolWidth = 0} =
                toolRef?.current?.getBoundingClientRect() ?? {}

            console.log('toolWidth', toolWidth)

            let realTop = top - cTop + comLayout.scrollTop

            const maskHeight = isRoot ? comLayout.scrollHeight : height

            // debugger

            setMaskPos({
                top: realTop,
                left: left - cLeft,
                width: isRoot ? width - 2 : width,
                height: Math.floor(maskHeight)
            })
            setRootToolPos({
                top: realTop + 32,
                left: width - 16
            })

            if (realTop <= 0) {
                realTop += maskHeight
            } else {
                realTop -= 20
            }

            if (toolWidth > width) {
                // 如果工具栏宽度大于组件宽度，则显示在组件左侧
                setToolPos({
                    top: realTop,
                    left: left - cLeft
                })
            } else {
                // 显示在组件右侧
                setToolPos({
                    top: realTop,
                    right: -(right - cRight)
                })
            }

            setCurComConfig(curComponentConfig)
        }

        function getCurrentConfig() {
            const curComponentConfig = componentConfig[focusCom?.name || '']
            const {isRoot} = curComponentConfig

            return {
                isRoot,
                curComponentConfig
            }
        }

        // 渲染工具
        const renderTool = () => {
            return (
                <div
                    ref={toolRef}
                    className='absolute text-[14px] z-[100]'
                    style={ToolPos}
                >
                    <div className='flex items-center justify-center gap-[5px]'>
                        <MaskTag>{curComConfig?.description}</MaskTag>
                        <MaskTag>{curComConfig?.description}</MaskTag>
                        <MaskTag>{curComConfig?.description}</MaskTag>
                        <MaskTag>{curComConfig?.description}</MaskTag>
                        <MaskTag>
                            <div
                                className='cursor-pointer'
                                onClick={deleteHandle}
                            >
                                <DeleteOutlined style={{color: '#fff'}} />
                            </div>
                        </MaskTag>
                    </div>
                </div>
            )
        }

        const deleteHandle = () => {
            deleteComponent(componentId)
            setCurComponentId(null)
        }

        // 对外暴露更新位置方法
        // @ts-ignore
        useImperativeHandle(ref, () => ({
            updatePosition
        }))

        if (maskContainerRef.current) {
            return createPortal(
                <>
                    <div
                        className='absolute z-10 border-x-2 border-y-2 border-solid border-[var(--edit-primary-color)] pointer-events-none rounded-[4px] box-border'
                        style={maskPos}
                    />

                    {curComConfig?.isRoot && (
                        <div
                            className='absolute text-white text-[12px] z-11 -translate-x-full -translate-y-full'
                            style={rootToolPos}
                        >
                            <MaskTag>{curComConfig?.description}</MaskTag>
                        </div>
                    )}
                    {!curComConfig?.isRoot && renderTool()}
                </>,
                maskContainerRef.current!
            )
        }

        return null
    }
)

export default SelectMask

import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useMemo,
    useEffect
} from 'react'
import {createPortal} from 'react-dom'
import {useComponents, useComponentConfigStore} from '@editor/stores'
import {getComponentById} from '@editor/utils'
import {checkValid} from './utils'
import {useObserve, useResize, useDebounce} from '@editor/hooks'
import {DeleteOutlined} from '@ant-design/icons'

interface Props {
    // 组件id
    componentId: string
    // 容器class
    containerClassName: string
}

const SelectMask = forwardRef<HTMLDivElement, Omit<Props, 'ref'>>(
    (props, ref) => {
        const {componentId, containerClassName} = props
        const toolRef = useRef<HTMLDivElement>(null)
        const {componentConfig} = useComponentConfigStore()
        const debouncedSetSearchTerm = useDebounce(updatePosition, 250)

        const {components, deleteComponent, setCurComponentId} = useComponents()
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
        const [ToolPos, setToolPos] = useState({
            left: 0,
            top: 0
        })

        // 获取当前组件
        const focusCom = useMemo(() => {
            return getComponentById(componentId, components)
        }, [componentId])

        const curComponentConfig = componentConfig[focusCom?.name || '']
        const {isRoot, description} = curComponentConfig

        // 获取 mask 容器
        const maskContainer = document.querySelector(`.${containerClassName}`)

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
            const valid = checkValid(componentId)
            if (!valid) return

            const {node, comLayout} = valid

            // 获取节点位置
            const {top, left, width, height} = node.getBoundingClientRect()
            // 获取容器位置
            const {top: cTop, left: cLeft} = comLayout.getBoundingClientRect()

            let realTop = top - cTop + comLayout.scrollTop

            const maskHeight = isRoot ? comLayout.scrollHeight : height

            setMaskPos({
                top: realTop,
                left: left - cLeft,
                width,
                height: maskHeight
            })
            setRootToolPos({
                top: realTop + 32,
                left: width - 16
            })

            if (realTop <= 0) {
                realTop += maskHeight + 20
            }

            setToolPos({
                top: realTop,
                left: left - cLeft + width
            })
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

        // @ts-ignore
        const MaskTag = ({children}) => {
            return (
                <div className='flex items-center justify-center px-[4px] h-[20px] bg-[var(--edit-primary-color)] whitespace-nowrap'>
                    {children}
                </div>
            )
        }

        if (maskContainer) {
            return createPortal(
                <>
                    <div
                        className='absolute z-10 border-x-2 border-y-2 border-solid border-[var(--edit-primary-color)] pointer-events-none rounded-[4px] box-border'
                        style={maskPos}
                    />

                    {isRoot && (
                        <div
                            className='absolute text-white text-[12px] z-11 -translate-x-full -translate-y-full'
                            style={rootToolPos}
                        >
                            <MaskTag>{description}</MaskTag>
                        </div>
                    )}
                    <div
                        ref={toolRef}
                        className='absolute text-[14px] z-11 -translate-y-full -translate-x-full'
                        style={ToolPos}
                    >
                        {!isRoot && (
                            <div className='flex items-center justify-center gap-[5px]'>
                                <MaskTag>
                                    <span className='text-xs text-white z-11'>
                                        {description}
                                    </span>
                                </MaskTag>
                                <MaskTag>
                                    <div
                                        className='cursor-pointer'
                                        onClick={deleteHandle}
                                    >
                                        <DeleteOutlined
                                            style={{color: '#fff'}}
                                        />
                                    </div>
                                </MaskTag>
                            </div>
                        )}
                    </div>
                </>,
                maskContainer!
            )
        }

        return null
    }
)

export default SelectMask

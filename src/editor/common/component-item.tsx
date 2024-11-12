import {useDrag} from 'react-dnd'
import {ComType} from '@editor/interface'
import SvgIcon from './svg-icon'
import React from 'react'
import {useComponentConfigStore} from '@editor/stores'

interface ComponentItemProps {
    // 组件名称
    name: string
    // 组件描述
    description: string
    // 拖拽结束回调
    onDragEnd: (...args: any[]) => void
    // 开始拖拽回调
    onDragStart: (...args: any[]) => void
    // 组件图标
    icon?: string
    // 组件类型
    comType: ComType
}

const ComponentItem: React.FC<ComponentItemProps> = (props) => {
    const {name, description, onDragEnd, icon, onDragStart} = props

    const {componentConfig} = useComponentConfigStore()

    const [{isDragging}, drag] = useDrag({
        type: name,
        end: (_, monitor) => {
            const dropResult = monitor.getDropResult()
            if (!dropResult) return

            const defaultProps = componentConfig?.[name]?.defaultProps || []

            const props: any = [...defaultProps]

            if (onDragEnd) {
                const option = {
                    name,
                    props,
                    description,
                    ...dropResult
                }
                // 拖拽结束回调
                onDragEnd(option)
            }
        },
        collect: (monitor) => ({
            // 是否正在拖拽
            isDragging: monitor.isDragging(),
            // 拖拽中的组件
            handlerId: monitor.getHandlerId()
        })
    })

    if (isDragging) {
        onDragStart()
    }

    return (
        <div
            ref={drag}
            className='component-item h-[100px] bg-white cursor-move py-[8px] px-[20px] flex justify-center items-center flex-col gap-[10px] hover:drop-shadow-lg border-[1px]'
        >
            <SvgIcon
                name={icon ? icon : 'component-default-icon'}
                iconStyle={{
                    width: 20,
                    height: 20
                }}
            />
            <p>{description}</p>
        </div>
    )
}

export default ComponentItem

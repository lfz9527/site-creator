import {useDrag} from 'react-dnd'
import {ItemType} from '@editor/item-type'
import {ComType} from '@editor/interface'
import SvgIcon from './svg-icon'
import React from 'react'

interface ComponentItemProps {
    // 组件名称
    name: string
    // 组件描述
    description: string
    // 拖拽结束回调
    onDragEnd: any
    // 组件图标
    icon?: string
    // 组件类型
    comType: ComType
}

const ComponentItem: React.FC<ComponentItemProps> = (props) => {
    const {name, description, onDragEnd, icon} = props

    const [{isDragging}, drag] = useDrag({
        type: name,
        end: (_, monitor) => {
            const dropResult = monitor.getDropResult()
            if (!dropResult) return
            if (onDragEnd) {
                const option = {
                    name,
                    props: name === ItemType.Button ? {children: '按钮'} : {},
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

    const opacity = isDragging ? 0.4 : 1

    return (
        <div
            ref={drag}
            className='component-item h-[100px] bg-white cursor-move py-[8px] px-[20px] flex justify-center items-center flex-col gap-[10px] hover:drop-shadow-lg border-[1px]'
            style={{
                opacity
            }}
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

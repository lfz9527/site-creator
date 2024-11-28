import {useDrag} from 'react-dnd'
import {ComType} from '@editor/interface'
import SvgIcon from './svg-icon'
import React, {useEffect, useMemo} from 'react'
import {useComponentConfigStore, useComponents} from '@editor/stores'

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
    [key: string]: any
}

const ComponentItem: React.FC<ComponentItemProps> = (props) => {
    const {name, description, onDragEnd, icon, onDragStart, comType} = props
    const {curComponentId, components} = useComponents()
    const {componentConfig} = useComponentConfigStore()

    // 使用 useMemo 来缓存 componentConfig 中的属性，避免每次渲染都重新计算
    const defaultProps = useMemo(
        () => componentConfig?.[name]?.defaultProps || [],
        [componentConfig, name]
    )

    const [{isDragging}, drag] = useDrag({
        type: name,
        item: {
            name
        },
        end: (_, monitor) => {
            const dropResult = monitor.getDropResult()
            if (!dropResult) return

            if (onDragEnd) {
                const dragOptions = {
                    name,
                    props: [...defaultProps],
                    type: comType,
                    description,
                    ...dropResult
                }

                // 拖拽结束回调
                onDragEnd(dragOptions)
            }
        },
        collect: (monitor) => ({
            // 是否正在拖拽
            isDragging: monitor.isDragging(),
            // 拖拽中的组件
            handlerId: monitor.getHandlerId()
        })
    })

    useEffect(() => {
        if (isDragging && onDragStart) {
            onDragStart()
        }
    }, [isDragging, onDragStart])

    const clickAddComponent = () => {
        const dragOptions = {
            name,
            props: [...defaultProps],
            type: comType,
            description,
            id: curComponentId ? curComponentId : components[0].id
        }
        onDragEnd(dragOptions)
    }

    // 点击组件进行添加
    return (
        <div
            ref={drag}
            onClick={clickAddComponent}
            className='flex items-center gap-2 h-[36px] bg-white px-2  border-[1px] border-solid border-[#e5e6e8] rounded-md cursor-grab hover:border-[#0089ff] hover:text-[#0089ff]  hover:fill-[#0089ff] '
        >
            <SvgIcon
                name={icon ? icon : 'component-default-icon'}
                iconStyle={{
                    width: 14,
                    height: 14
                }}
            />
            <p className='text-xs text-center '>{description}</p>
        </div>
    )
}

export default ComponentItem

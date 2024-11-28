import {CommonComponentProps} from '@editor/interface'
import {useDrag, useDrop} from '@editor/hooks'
import Empty from './empty'
import {message} from 'antd'
import CanDrop from './canDrop'
import DropZone from './dropZone'
import React, {useRef, useCallback, useState} from 'react'

type PageItemType = {
    isContainer?: boolean
    direction?: dropZoneType
    hasChild: boolean
    canDrop?: React.ReactNode
    empty?: React.ReactNode
    children?: React.ReactNode
}
type Props = CommonComponentProps & PageItemType

const ComponentPageItem: React.FC<Props> = (props) => {
    const {
        children,
        _id,
        _name,
        isContainer,
        comPageStyle = {},
        hasChild = false
    } = props
    const [messageApi, contextHolder] = message.useMessage()
    // 使用 useRef 创建一个可变的引用
    const comRef = useRef<HTMLElement | null>(null)
    const [hightPosition, setHighPosition] =
        useState<insertPositionType | null>(null)
    const {drag} = useDrag({
        id: _id,
        componentName: _name,
        onDragEndState: (insert) => {
            !insert &&
                messageApi.open({
                    type: 'error',
                    content: '组件移动失败'
                })
        }
    })
    const {drop, isOverCurrent} = useDrop({
        id: _id,
        componentName: _name,
        onHover(_, monitor) {
            const clientOffset = monitor.getClientOffset()
            const dropCom = comRef.current?.getBoundingClientRect() // 获取组件的位置和尺寸
            if (clientOffset && dropCom) {
                // 计算拖拽点相对于组件 B 的位置
                const relativeX = clientOffset.x - dropCom.left
                const relativeY = clientOffset.y - dropCom.top

                // 根据相对位置决定插入区域
                const position = getInsertPosition(
                    relativeX,
                    relativeY,
                    dropCom.width,
                    dropCom.height
                )
                setHighPosition(position)

                return position
            }
        }
    })

    // 计算拖拽点的位置：左边、中间或右边
    const getInsertPosition = (
        x: number,
        y: number,
        width: number,
        height: number
    ): insertPositionType => {
        const halfWidth = width / 2
        const halfHeight = height / 2

        // 判断拖拽位置是否接近上、下、左、右或中心
        if (y < halfHeight / 2) {
            return 'top' // 上
        } else if (y > height - halfHeight / 2) {
            return 'bottom' // 下
        } else if (x < halfWidth / 2) {
            return 'left' // 左
        } else if (x > width - halfWidth / 2) {
            return 'right' // 右
        } else {
            return 'center' // 中心
        }
    }

    const handleRef = useCallback(
        (node: HTMLElement | null) => {
            if (node) {
                drag(drop(node)) // 应用 drag 和 drop 引用
                comRef.current = node // 保存节点到 comRef
            }
        },
        [drag, drop]
    )

    const styles = {
        display: isContainer ? 'block' : 'inline-block',
        position: 'relative',
        ...comPageStyle
    }

    const isCover = !!isOverCurrent

    // 渲染高亮区域
    function renderHighlight() {
        if (hightPosition === 'center') return <CanDrop />

        const dropDom = comRef.current?.getBoundingClientRect()
        if (!dropDom) return ''

        const {width, height} = dropDom

        const zoneStyle: React.CSSProperties = {
            position: 'absolute'
        }

        if (hightPosition === 'left') {
            zoneStyle.top = 0
            zoneStyle.width = 5
            zoneStyle.left = 0
            zoneStyle.height = height
        }
        if (hightPosition === 'right') {
            zoneStyle.top = 0
            zoneStyle.width = 5
            zoneStyle.height = height
            zoneStyle.right = 0
        }
        if (hightPosition === 'top') {
            zoneStyle.top = 0
            zoneStyle.height = 5
            zoneStyle.width = width
        }
        if (hightPosition === 'bottom') {
            zoneStyle.height = 5
            zoneStyle.width = width
            zoneStyle.bottom = 0
        }

        return <DropZone zoneStyle={zoneStyle} />
    }

    return (
        <div ref={handleRef} style={styles} data-component-id={_id}>
            {contextHolder}
            {isCover && hightPosition && renderHighlight()}
            {hasChild ? children : <Empty _id={_id} />}
        </div>
    )
}

export default ComponentPageItem

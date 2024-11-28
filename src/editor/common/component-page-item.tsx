import {CommonComponentProps} from '@editor/interface'
import {useDrag, useDrop} from '@editor/hooks'
import Empty from './empty'
import {message} from 'antd'
import CanDrop from './canDrop'
import React, {useRef, useCallback} from 'react'

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
    const {drag} = useDrag({
        id: _id,
        componentName: _name,
        onDragEnd: (insert) => {
            !insert &&
                messageApi.open({
                    type: 'error',
                    content: '组件移动失败'
                })
        }
    })
    const {drop, isOverCurrent} = useDrop({
        id: _id,
        componentName: _name
    })

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

    return (
        <div ref={handleRef} style={styles} data-component-id={_id}>
            {contextHolder}
            {isCover && <CanDrop />}
            {hasChild ? children : <Empty _id={_id} />}
        </div>
    )
}

export default ComponentPageItem

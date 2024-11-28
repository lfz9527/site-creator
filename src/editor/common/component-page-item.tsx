import {CommonComponentProps} from '@editor/interface'
import {DropTargetMonitor} from 'react-dnd'
import {useDrag, useDrop} from '@editor/hooks'
import Empty from '@/editor/common/empty'
import {message} from 'antd'
import CanDrop from './canDrop'
import React, {useRef, useState, useCallback} from 'react'

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
    const [lightLf, setLightLf] = useState(false)
    const [lightRt, setLightRt] = useState(false)
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
        componentName: _name,
        onHover: dropHover
    })

    function dropHover(_: any, monitor: DropTargetMonitor) {
        if (!monitor.canDrop()) return
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

    return (
        <div ref={handleRef} style={styles} data-component-id={_id}>
            {contextHolder}
            {/* B左边高亮区域 */}
            {lightLf && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '200px',
                        height: '100%',
                        backgroundColor: 'rgba(0, 255, 0, 0.3)'
                    }}
                />
            )}
            {/* B右边高亮区域 */}
            {lightRt && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '150px',
                        width: '350px',
                        height: '100%',
                        backgroundColor: 'rgba(255, 0, 0, 0.3)'
                    }}
                />
            )}
            {isCover && <CanDrop />}
            {hasChild ? children : <Empty _id={_id} />}
        </div>
    )
}

export default ComponentPageItem

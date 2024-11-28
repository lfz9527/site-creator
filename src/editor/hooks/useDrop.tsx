// 定义组件如何接收拖拽的数据和如何响应拖拽操作
import {useDrop as useDndDrop, DropTargetMonitor} from 'react-dnd'
import {getAcceptDrop} from '@editor/utils'

interface Props {
    id: string
    componentName: string
    onHover?: (_: any, monitor: DropTargetMonitor) => void
}

const useDrop = (props: Props) => {
    const {id, componentName, onHover} = props
    const [{canDrop, isOverCurrent, isOver}, drop] = useDndDrop(
        {
            accept: getAcceptDrop(componentName),
            drop: (_: any, monitor) => {
                const didDrop = monitor.didDrop()
                if (didDrop) {
                    return
                }
                // 这里把当前组件的id返回出去，在拖拽结束事件里可以拿到这个id。
                return {
                    id
                }
            },
            hover: (_, monitor: DropTargetMonitor) => {
                onHover && onHover(_, monitor)
            },
            collect: (monitor: DropTargetMonitor) => ({
                isOverCurrent: monitor.isOver({shallow: true}),
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            })
        },
        [id]
    )
    return {
        drop,
        canDrop,
        isOver,
        isOverCurrent
    }
}

export default useDrop

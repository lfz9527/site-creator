import {useDrag as useDndDrag} from 'react-dnd'
import {useComponents} from '@editor/stores'

interface Props {
    id: string
    componentName: string
    onDragEndState?: (...args: any[]) => void
}

/**
 *
 * @param id
 * @param componentName
 * @param onDragEnd
 * @returns
 */
const useDrag = (props: Props) => {
    const {id, componentName, onDragEndState} = props
    const {insertComponent} = useComponents()
    const [{isDragging, handlerId}, drag] = useDndDrag({
        type: componentName,
        item: {
            name: componentName,
            id
        },
        end: (_, monitor) => {
            const dropResult = monitor.getDropResult()
            if (!dropResult) return
            const option: {
                id: string
                [key: string]: any
            } = {id: '', ...dropResult}
            const insert = insertComponent(option.id, id, option.insertPosition)

            onDragEndState && onDragEndState(insert)
        },
        collect: (monitor) => ({
            // 是否正在拖拽
            isDragging: monitor.isDragging(),
            // 拖拽中的组件
            handlerId: monitor.getHandlerId()
        })
    })

    return {
        drag,
        handlerId,
        isDragging
    }
}
export default useDrag

import {useDrag as useDndDrag} from 'react-dnd'
import {useComponents} from '@editor/stores'

/**
 *
 * @param id
 * @param componentName
 * @param onDragEnd
 * @returns
 */
const useDrag = (
    id: string,
    componentName: string,
    onDragEnd?: (...args: any[]) => void
) => {
    const {insertComponent} = useComponents()
    const [{isDragging, handlerId}, drag] = useDndDrag({
        type: componentName,
        end: (_, monitor) => {
            const dropResult = monitor.getDropResult()
            if (!dropResult) return
            const option: {
                id: string
                [key: string]: any
            } = {id: '', ...dropResult}

            const insert = insertComponent(option.id, id)

            onDragEnd && onDragEnd(insert)
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

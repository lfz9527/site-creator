import {useDrag as useDndDrag} from 'react-dnd'
import {useComponents} from '@editor/stores'

const validDirect = (id: string): dropZoneType | null => {
    const [, direct] = id?.split('-') || []
    if (!direct) return null
    return direct as dropZoneType
}

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

            const direct = validDirect(option.id)
            let targetId = option.id

            if (direct) {
                targetId = option.id.replace(/-vertical|-horizontal/, '')
            }

            console.log('targetId', targetId, id)

            const insert = insertComponent(targetId, id, direct)

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

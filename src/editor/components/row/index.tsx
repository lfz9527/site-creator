import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'

const Row: React.FC<CommonComponentProps> = (props) => {
    const {children, _id, _name} = props
    const {drop, canDrop} = useDrop(_id, _name)

    return (
        <div ref={drop} data-component-id={_id}>
            Row {children}
        </div>
    )
}

export default Row

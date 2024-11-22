import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'
import CanDrop from '@/editor/common/canDrop'
import Empty from '@/editor/common/empty'
import './index.css'

const Col: React.FC<CommonComponentProps> = (props) => {
    const {children, _id, _name} = props
    const {drop, isOver} = useDrop(_id, _name)

    return (
        <ComponentPageItem {...{...props, isContainer: true}}>
            <div
                ref={drop}
                data-component-id={_id}
                className='relative'
                style={{
                    flexShrink: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '200px'
                }}
            >
                {isOver && <CanDrop />}
                {children && children.length ? children : <Empty _id={_id} />}
            </div>
        </ComponentPageItem>
    )
}

export default Col

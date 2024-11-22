import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'
import {useComponents} from '@editor/stores'
import {useRef, useEffect} from 'react'
import {useScroll} from '@editor/hooks'
import CanDrop from '@/editor/common/canDrop'
import Empty from '@/editor/common/empty'

import './index.css'

const Row: React.FC<CommonComponentProps> = (props) => {
    const {children, _id, _name} = props
    const {setCurComponentId, curComponentId} = useComponents()
    const {drop, isOver} = useDrop(_id, _name)
    const rowRef = useRef(null)
    // 动态绑定 ref
    useEffect(() => {
        if (rowRef.current) {
            drop(rowRef.current)
        }
    }, [drop])

    useScroll(
        () => {
            curComponentId && setCurComponentId(null)
        },
        rowRef.current as unknown as HTMLElement
    )

    return (
        <ComponentPageItem {...{...props, isContainer: true}}>
            <div
                ref={rowRef}
                data-component-id={_id}
                className='relative'
                style={{
                    display: 'flex',
                    overflowX: 'auto'
                }}
            >
                {isOver && <CanDrop />}
                {children && children.length ? children : <Empty _id={_id} />}
            </div>
        </ComponentPageItem>
    )
}

export default Row

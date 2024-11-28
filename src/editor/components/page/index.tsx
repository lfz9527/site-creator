import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import {useEffect} from 'react'
import {useComponents} from '@/editor/stores'

const Page: React.FC<CommonComponentProps> = (props) => {
    const {setCurComponentId} = useComponents()
    const {children, _id, _name} = props
    const {drop, canDrop, isOverCurrent} = useDrop({
        id: _id,
        componentName: _name
    })

    // 拖拽时，其他选中效果消失
    useEffect(() => {
        if (canDrop) {
            setCurComponentId(null)
        }
    }, [canDrop, setCurComponentId])

    return (
        <div
            ref={drop}
            static-type='root-page'
            className='w-full h-full overflow-x-hidden bg-white'
            style={{
                transition: 'width 0.1s ease',
                backgroundColor: isOverCurrent ? '#f5fafe' : '#fff'
            }}
            data-component-id={_id}
        >
            {children}
        </div>
    )
}

export default Page

import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import {useEffect} from 'react'
import {useComponents} from '@/editor/stores'

const Page: React.FC<CommonComponentProps> = (props) => {
    const {setCurComponentId} = useComponents()
    const {children, _id, _name} = props
    const {drop, canDrop} = useDrop(_id, _name)

    const showHover = () => canDrop && !(children && children.length > 0)

    // 拖拽时，其他选中效果消失
    useEffect(() => {
        if (canDrop) {
            setCurComponentId(null)
        }
    }, [canDrop])

    return (
        <div
            ref={drop}
            static-type='root-page'
            className='w-full bg-white'
            style={{
                width: '100%',
                height: '100%',
                transition: 'width 0.1s ease',
                backgroundColor: showHover() ? '#f5fafe' : '#fff'
            }}
            data-component-id={_id}
        >
            {children}
        </div>
    )
}

export default Page

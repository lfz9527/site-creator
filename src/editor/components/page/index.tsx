import {useState} from 'react'
import {useDrop, useObserve, useScroll} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import {useEffect} from 'react'
import {useComponents} from '@/editor/stores'
import {stageComLayoutId} from '@editor/enum'

const Page: React.FC<CommonComponentProps> = (props) => {
    const {setCurComponentId} = useComponents()
    const {children, _id, _name} = props
    const {drop, canDrop} = useDrop(_id, _name)
    const [height, setHeight] = useState<string | number>('100%')

    const showHover = () => canDrop && !(children && children.length > 0)

    // 拖拽时，其他选中效果消失
    useEffect(() => {
        if (canDrop) {
            setCurComponentId(null)
        }
    }, [canDrop])

    const container = document.querySelector(
        `#${stageComLayoutId}`
    ) as HTMLElement

    // useScroll(() => {
    //     const realHeight = container.scrollHeight
    //     setHeight(Number(realHeight))
    // }, container!)

    useEffect(() => {
        // @TODO 当高度变化时，需要刷新一次 选中 mask 位置
    }, [height])

    return (
        <div
            ref={drop}
            static-type='root-page'
            className='w-full bg-white'
            style={{
                width: '100%',
                height,
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

import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'
import {useComponents} from '@editor/stores'
import {useRef, useEffect} from 'react'
import {useScroll} from '@editor/hooks'

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

    const empty = () => {
        return (
            <div className='h-[100px] bg-[#f0f0f0] flex justify-center items-center text-xs text-[#a7b1bd] select-none px-[10px] w-full box-border border-[1px] border-dotted border-[rgb(167, 177, 189)]'>
                拖拽组件或容器到此处{_id}
            </div>
        )
    }
    const model = () => {
        return <div className='canDrop' />
    }

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
                {isOver && model()}
                {children && children.length ? children : empty()}
            </div>
        </ComponentPageItem>
    )
}

export default Row

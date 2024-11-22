import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'

import './index.css'

const Col: React.FC<CommonComponentProps> = (props) => {
    const {children, _id, _name} = props
    const {drop, isOver} = useDrop(_id, _name)

    const empty = () => {
        return (
            <div className='h-[100px] bg-[#f0f0f0] flex justify-center items-center text-xs text-[#a7b1bd] select-none px-[10px] w-full border-2 border-[#a7b1bd]-600'>
                列布局拖拽组件或容器到此处{_id}
            </div>
        )
    }
    const model = () => {
        return <div className='canDrop' />
    }

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
                {isOver && model()}
                {children && children.length ? children : empty()}
            </div>
        </ComponentPageItem>
    )
}

export default Col

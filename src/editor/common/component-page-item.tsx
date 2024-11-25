import {CommonComponentProps} from '@editor/interface'
import {useDrag, useDrop} from '@editor/hooks'
import Empty from '@/editor/common/empty'
import {message} from 'antd'

import React from 'react'

type PageItemType = {
    isContainer?: boolean
    direction?: dropZoneType
    hasChild: boolean
    canDrop?: React.ReactNode
    empty?: React.ReactNode
    children?: React.ReactNode
}
type Props = CommonComponentProps & PageItemType

const ComponentPageItem: React.FC<Props> = (props) => {
    const {
        children,
        _id,
        _name,
        isContainer,
        comPageStyle = {},
        hasChild = false
    } = props
    const [messageApi, contextHolder] = message.useMessage()
    const {drop, isOverCurrent, isOver} = useDrop(_id, _name)
    const {drag} = useDrag(_id, _name, (insert) => {
        !insert &&
            messageApi.open({
                type: 'error',
                content: '组件移动失败'
            })
    })

    const styles = {
        display: isContainer ? 'block' : 'inline-block',
        ...comPageStyle
    }

    const isCover = !!(isOverCurrent || isOver)

    return (
        <div
            ref={(node) => drag(drop(node))}
            // ref={drop}
            style={styles}
            data-component-id={_id}
        >
            {contextHolder}
            {hasChild ? children : <Empty _id={_id} isCover={isCover} />}
        </div>
    )
}

export default ComponentPageItem

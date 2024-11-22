import {CommonComponentProps} from '@editor/interface'
import {useDrag, useDrop} from '@editor/hooks'
import {message} from 'antd'

import React from 'react'

type PageItemType = {
    isContainer?: boolean
    direction?: dropZoneType
    children?: React.ReactNode
}
type Props = CommonComponentProps & PageItemType

const ComponentPageItem: React.FC<Props> = (props) => {
    const {children, _id, _name, isContainer, comPageStyle = {}} = props
    const [messageApi, contextHolder] = message.useMessage()
    const {drop} = useDrop(_id, _name)
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

    return (
        <div
            ref={(node) => drag(drop(node))}
            style={styles}
            className='relative'
        >
            {contextHolder}
            {children}
        </div>
    )
}

export default ComponentPageItem

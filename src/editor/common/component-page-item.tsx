import {CommonComponentProps} from '@editor/interface'
import {useDrag} from '@editor/hooks'
import {message} from 'antd'

type PageItemType = {
    isContainer?: boolean
}
type Props = CommonComponentProps & PageItemType

const Button: React.FC<Props> = (props) => {
    const {children, _id, _name, isContainer} = props
    const [messageApi, contextHolder] = message.useMessage()
    const {drag} = useDrag(_id, _name, (insert) => {
        !insert &&
            messageApi.open({
                type: 'error',
                content: '组件移动失败'
            })
    })

    const styles = {
        display: isContainer ? 'block' : 'inline-block'
    }

    return (
        <>
            {contextHolder}
            <div ref={drag} style={styles}>
                {children}
            </div>
        </>
    )
}

export default Button

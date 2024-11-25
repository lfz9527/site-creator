import {CommonComponentProps} from '@editor/interface'
import {Button as AntdButton} from 'antd'
import ComponentPageItem from '@editor/common/component-page-item'

const Button: React.FC<CommonComponentProps> = (props) => {
    const {_id, type, text} = props

    return (
        <ComponentPageItem {...{...props, hasChild: true}}>
            <AntdButton data-component-id={_id} type={type}>
                {text || '测试按钮文字'}
            </AntdButton>
        </ComponentPageItem>
    )
}

export default Button

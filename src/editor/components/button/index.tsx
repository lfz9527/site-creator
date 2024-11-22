import {CommonComponentProps} from '@editor/interface'
import {Button as AntdButton} from 'antd'
import {useDrop} from '@/editor/hooks'
import ComponentPageItem from '@editor/common/component-page-item'

const Button: React.FC<CommonComponentProps> = (props) => {
    const {_id, type, text, _name} = props
    const {drop} = useDrop(_id, _name)

    return (
        <ComponentPageItem {...props}>
            <AntdButton ref={drop} data-component-id={_id} type={type}>
                {text || '测试按钮文字'}
            </AntdButton>
        </ComponentPageItem>
    )
}

export default Button

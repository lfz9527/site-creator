import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'
import './index.css'

const Col: React.FC<CommonComponentProps> = (props) => {
    const {children} = props
    const hasChild = children && children.length > 0

    const comPageStyle = {
        width: '100%',
        height: '200px'
    }

    return (
        <ComponentPageItem
            {...{
                ...props,
                isContainer: true,
                hasChild,
                comPageStyle
            }}
        >
            {children}
        </ComponentPageItem>
    )
}

export default Col

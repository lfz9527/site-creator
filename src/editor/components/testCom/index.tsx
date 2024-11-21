import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'
import ComponentIframe from '@editor/common/component-iframe'

const Row: React.FC<CommonComponentProps> = (props) => {
    const {_id} = props

    return (
        <ComponentPageItem
            {...{
                ...props,
                isContainer: true,
                comPageStyle: {
                    flex: '1'
                }
            }}
        >
            <div
                data-component-id={_id}
                className='relative'
                style={{
                    flex: 1
                }}
            >
                <ComponentIframe url='http://localhost:5137/partview/goodscrollright' />
            </div>
        </ComponentPageItem>
    )
}

export default Row

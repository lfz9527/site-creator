import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'

const Page: React.FC<CommonComponentProps> = (props) => {
    const {children, _id, _name} = props
    const {drop, canDrop} = useDrop(_id, _name)

    return (
        <div
            ref={drop}
            static-type='root-page'
            className='w-full h-full overflow-hidden bg-white'
            style={{
                transition: 'width 0.1s ease',
                border: canDrop ? '1px solid #006cff' : 'none'
            }}
            data-component-id={_id}
        >
            {children}
        </div>
    )
}

export default Page

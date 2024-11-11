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
                border: `2px solid ${canDrop ? 'var(--edit-primary-color)' : '#fff'}`
            }}
            data-component-id={_id}
        >
            {children}
        </div>
    )
}

export default Page

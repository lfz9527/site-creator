import {useDrop} from '@/editor/hooks'
import {CommonComponentProps} from '@editor/interface'
import {useEffect, useState} from 'react'

const Page: React.FC<CommonComponentProps> = (props) => {
    const {children, _id, _name, containerId} = props
    const {drop, canDrop} = useDrop(_id, _name)
    const [height, setHeight] = useState<number | string>('100%')

    const showHover = () => canDrop && !(children && children.length > 0)

    useEffect(() => {
        console.log('containerId', containerId)
        const container = document.querySelector(`#${containerId}`)

        container?.addEventListener('scroll', () => {
            setHeight(container?.scrollHeight)
        })

        return () => {
            container?.removeEventListener('scroll', () => {
                setHeight(container?.scrollHeight)
            })
        }
    }, [])

    return (
        <div
            ref={drop}
            static-type='root-page'
            className='w-full bg-white'
            style={{
                width: '100%',
                height,
                transition: 'width 0.1s ease',
                backgroundColor: showHover() ? '#f5fafe' : '#fff'
            }}
            data-component-id={_id}
        >
            {children}
        </div>
    )
}

export default Page

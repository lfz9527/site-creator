import {CommonComponentProps} from '@editor/interface'
import ComponentPageItem from '@editor/common/component-page-item'
import {useComponents} from '@editor/stores'
import {useRef} from 'react'
import {useScroll} from '@editor/hooks'
import './index.css'

const Row: React.FC<CommonComponentProps> = (props) => {
    const {children} = props
    const {setCurComponentId, curComponentId} = useComponents()
    const rowRef = useRef(null)
    const hasChild = children && children.length > 0

    useScroll(
        () => {
            curComponentId && setCurComponentId(null)
        },
        rowRef.current as unknown as HTMLElement
    )

    return (
        <ComponentPageItem {...{...props, isContainer: true, hasChild}}>
            <div
                ref={rowRef}
                style={{
                    display: 'flex',
                    overflowX: 'auto'
                }}
            >
                {children}
            </div>
        </ComponentPageItem>
    )
}

export default Row

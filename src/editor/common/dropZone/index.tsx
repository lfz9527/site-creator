import React from 'react'
import './index.css'
import {useDrop} from '@editor/hooks'

interface DropZoneProps {
    direction: dropZoneType
    [key: string]: any
}
const DropZone: React.FC<DropZoneProps> = (props) => {
    const {direction, _id, _name} = props
    const {isOver, drop} = useDrop(`${_id}-${direction}`, _name)
    const className = `drop-zone-${direction}`

    // console.log('isOver', isOver, _id)

    return (
        <div
            ref={drop}
            className={`drop-zone ${className} ${isOver ? 'focus' : ''}`}
        ></div>
    )
}

export default DropZone
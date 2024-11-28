import React from 'react'

interface DropZoneProps {
    style?: React.CSSProperties
}
const DropZone: React.FC<DropZoneProps> = (props) => {
    const {style} = props

    return (
        <div
            id='drop-zone'
            style={{
                ...style
            }}
        ></div>
    )
}

export default DropZone

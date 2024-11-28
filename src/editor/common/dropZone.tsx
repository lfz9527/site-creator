import React from 'react'

interface DropZoneProps {
    zoneStyle?: React.CSSProperties
}
const DropZone: React.FC<DropZoneProps> = (props) => {
    const {zoneStyle} = props

    return (
        <div
            id='drop-zone'
            style={{
                backgroundColor: 'var(--edit-primary-color)',
                ...zoneStyle
            }}
        ></div>
    )
}

export default DropZone

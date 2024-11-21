import React from 'react'

interface Prop {
    url: string
}

const ComponentIframe: React.FC<Prop> = ({url}) => {
    return (
        <div>
            <iframe
                src={url}
                style={{
                    width: '100%',
                    height: '100%',
                    borderWidth: 0,
                    pointerEvents: 'none'
                }}
            ></iframe>
        </div>
    )
}

export default React.memo(ComponentIframe)

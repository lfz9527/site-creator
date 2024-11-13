import React from 'react'

interface MaskTagProps {
    children: React.ReactNode
    // 其他可能的属性...
}

const MaskTag: React.FC<MaskTagProps> = (props) => {
    const {children} = props
    return (
        <div className='flex items-center justify-center px-[4px] h-[20px] bg-[var(--edit-primary-color)] whitespace-nowrap rounded text-white text-xs'>
            {children}
        </div>
    )
}
export default MaskTag

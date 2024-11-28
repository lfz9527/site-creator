interface EmptyProps {
    _id?: string
    isCover?: boolean
}
const Empty: React.FC<EmptyProps> = ({_id, isCover = false}) => {
    const style = {
        backgroundColor: 'rgba(175, 204, 244,.5)',
        borderColor: 'rgba(175, 204, 244,.5)'
    }

    return (
        <div
            className='bg-[#f0f0f0] flex justify-center items-center text-xs text-[#a7b1bd] select-none px-[10px] w-full h-[100px] border-2 border-solid border-[#a7b1bd]-600'
            style={isCover ? style : {}}
        >
            {!isCover && ` 列布局拖拽组件或容器到此处${_id}`}
        </div>
    )
}

export default Empty

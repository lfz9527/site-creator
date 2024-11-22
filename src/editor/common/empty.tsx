interface EmptyProps {
    _id?: string
}
const Empty: React.FC<EmptyProps> = ({_id}) => {
    return (
        <div className='h-[100px] bg-[#f0f0f0] flex justify-center items-center text-xs text-[#a7b1bd] select-none px-[10px] w-full border-2 border-[#a7b1bd]-600'>
            列布局拖拽组件或容器到此处{_id}
        </div>
    )
}

export default Empty

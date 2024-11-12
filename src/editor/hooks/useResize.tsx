import {useEffect} from 'react'
const useResize = (callback: (event?: UIEvent) => void, rightNow?: boolean) => {
    useEffect(() => {
        // 创建事件监听器
        const handleResize = (event?: UIEvent) => {
            callback(event)
        }

        // 立即执行回调函数
        if (rightNow) callback()

        // 添加 resize 事件监听
        window.addEventListener('resize', handleResize)

        // 组件卸载时移除事件监听
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
}

export default useResize

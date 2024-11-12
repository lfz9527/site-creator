import {useEffect} from 'react'

const useScroll = (
    callback: (...args: any[]) => void,
    container?: HTMLElement | Element
) => {
    useEffect(() => {
        // 创建事件监听器
        const handleResize = (...args: any[]) => {
            callback(...args)
        }
        const containerDom = container ? container : window

        console.log('container', container)

        // 添加 resize 事件监听
        containerDom.addEventListener('scroll', handleResize)

        // 组件卸载时移除事件监听
        return () => {
            containerDom.removeEventListener('scroll', handleResize)
        }
    }, [container])
}

export default useScroll

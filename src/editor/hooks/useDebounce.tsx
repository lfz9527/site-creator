import {useEffect, useRef, useCallback} from 'react'

// useDebounce Hook，接受一个回调函数和延迟时间
const useDebounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null) // 用来存储 setTimeout 的 ID

    // 返回一个封装过的函数
    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            // 清除之前的定时器
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            // 设置新的定时器，延迟执行 fn
            timeoutRef.current = setTimeout(() => {
                fn(...args) // 最后一次调用 fn
            }, delay)
        },
        [fn, delay] // 如果 fn 或 delay 变化，重新创建 debouncedFn
    )

    // 清理定时器
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return debouncedFn
}

export default useDebounce

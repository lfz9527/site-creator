import {observeContainer} from '@editor/utils'
import {useEffect} from 'react'
import {stageContainerId} from '@editor/enum'

/**
 *
 * @param callback 回调函数
 * @param options
 */
const useObserve = (
    callback: (container: HTMLElement, entries?: ResizeObserverEntry[]) => void,
    options: observeOpt = {
        containerId: stageContainerId
    }
) => {
    useEffect(() => {
        const {resizeObserver, container} = observeContainer(callback, {
            ...options
        })
        return () => {
            if (container) {
                resizeObserver.unobserve(container)
            }
        }
    }, [])
}

export default useObserve

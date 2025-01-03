import React, {useRef, useState, useEffect} from 'react'
import {useResize, useObserve, useStageMask} from '@editor/hooks'
import {useComponents, useStageConfig} from '@editor/stores'
import {stageContainerId, stageComLayoutId} from '@editor/enum'

import StageContainer from './stage-container'
import SelectedMask from '@/editor/common/mask/selected'
import HoverMask from '@/editor/common/mask/hover'

const Stage: React.FC = () => {
    const wrapRef = useRef<HTMLDivElement>(null)
    const comLayoutRef = useRef<HTMLDivElement>(null)
    const maskRef = useRef(null)
    const {curComponentId, setCurComponentId, hoverComponentId} =
        useComponents()
    const {setStageWidth} = useStageConfig()
    const {maskContainerRef, maskDiv} = useStageMask(maskRef)

    const [wh, setWh] = useState({
        width: '100%',
        height: '100%'
    })

    // 监听窗口变化
    useResize(() => {
        initWH()
    })

    // 初始化画布容器宽高
    const initWH = () => {
        const wrap = wrapRef.current
        setWh({
            width: wrap?.offsetWidth + 'px',
            height: wrap?.offsetHeight + 'px'
        })
    }

    // 监听画布容器变化
    useObserve(() => {
        // 画布容器变化时，清空选中状态
        setCurComponentId(null)
        initWH()
    })
    useEffect(() => {
        // 存储画布宽度
        setStageWidth(wrapRef.current?.offsetWidth || '100%')
    }, [])

    return (
        <div
            ref={wrapRef}
            id={stageContainerId}
            className='relative w-full h-full overflow-hidden bg-white'
        >
            {curComponentId && (
                <SelectedMask
                    componentId={curComponentId}
                    maskContainerRef={maskContainerRef}
                    ref={maskRef}
                />
            )}
            {hoverComponentId && (
                <HoverMask
                    maskContainerRef={maskContainerRef}
                    ref={maskRef}
                    componentId={hoverComponentId}
                />
            )}
            <div
                className='absolute top-0 left-0 right-0 overflow-x-hidden overflow-y-auto'
                id={stageComLayoutId}
                ref={comLayoutRef}
                style={{
                    ...wh
                }}
            >
                {maskDiv()}
                <StageContainer />
            </div>
        </div>
    )
}
export default Stage

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
    const {curComponentId} = useComponents()
    const {setStageWidth} = useStageConfig()
    const {hoverComponentId, maskContainerRef, maskDiv} = useStageMask(maskRef)

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
        initWH()
    })
    useEffect(() => {
        // 存储画布宽度
        setStageWidth(wrapRef.current?.offsetWidth || '100%')
    }, [])

    // 动画
    const tranStyle = {
        transition: 'width 0.2s ease-in-out' // 添加过渡效果
    }

    return (
        <div
            ref={wrapRef}
            id={stageContainerId}
            className='relative w-full h-full overflow-hidden bg-white'
            style={{
                ...tranStyle
            }}
        >
            <div
                className='absolute top-0 left-0 right-0 overflow-x-hidden overflow-y-auto'
                id={stageComLayoutId}
                ref={comLayoutRef}
                style={{
                    ...wh,
                    ...tranStyle
                }}
            >
                <StageContainer />
                {maskDiv()}
            </div>

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
        </div>
    )
}
export default Stage

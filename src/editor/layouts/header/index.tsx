import {useCallback, useEffect, useState} from 'react'
import {Button, Space, Popconfirm} from 'antd'
import {useStageConfig, useComponents} from '@editor/stores'
import SvgIcon from '@/editor/common/svg-icon'
import {initStage} from '@editor/utils'
import './index.less'

interface screens {
    name: string
    size: string
    full: boolean
    min: string
    max?: string
    isCurIframe: boolean
}

const screenIframe: screens[] = [
    {
        name: 'pc',
        size: '100%',
        full: true,
        min: '768',
        isCurIframe: true
    },
    {
        name: 'ipad',
        size: '768',
        max: '768',
        min: '375',
        isCurIframe: false,
        full: false
    },
    {
        name: 'phone',
        size: '375',
        max: '375',
        min: '0',
        isCurIframe: false,
        full: false
    }
]

const Header = () => {
    const [screens, setScreens] = useState<screens[]>(screenIframe)
    const {width, setStageWidth} = useStageConfig()
    const {initPage} = useComponents()

    // 屏幕大小列表
    useEffect(() => {
        screenChange(width)
    }, [width])

    // 屏幕尺寸变化
    function screenChange(width: number | string) {
        setScreens((scr) => {
            setStageWidth(width)
            return scr.map((item) => {
                return {
                    ...item,
                    // 计算当前屏幕是否复合既定的屏幕尺寸
                    isCurIframe:
                        width > item.min &&
                        (item.max ? width <= item.max : true)
                }
            })
        })
    }

    // 切换屏幕大小
    const changeScreen = useCallback((screen: any) => {
        const iframe = document.getElementById('stage-container') as HTMLElement

        const iframeWrap = iframe?.parentElement as HTMLElement
        const iframeWrapWidth = iframeWrap.offsetWidth - 32
        if (iframe) {
            const width = screen.full ? iframeWrapWidth : screen.size
            screenChange(width)
            iframe.style.width = `${width}px`
        }
    }, [])

    // 保存页面
    const savePage = () => {}

    // 预览页面
    const previewPage = () => {}

    // 清空画布
    const clearPage = () => {
        initStage()
    }

    return (
        <div className='w-[100%] h-[100%] bg-white'>
            <div className='flex px-[24px] py-[6px] items-center'>
                <div className='area-left w-[400px]'></div>
                <Space className='flex items-center justify-center flex-grow area-center'>
                    {screens.map((item) => {
                        return (
                            <div
                                key={item.name}
                                className={`screen-item cursor-pointer w-[32px] h-[32px] flex items-center justify-center ${item.isCurIframe && 'active-screen'}`}
                                onClick={() => changeScreen(item)}
                            >
                                <SvgIcon
                                    name={item.name}
                                    iconStyle={{
                                        width: '24px',
                                        height: '24px',
                                        color: 'rgba(0,0,0,0.6)'
                                    }}
                                />
                            </div>
                        )
                    })}
                </Space>
                <Space className='flex justify-end ml-auto mr-0 area-right w-[400px]'>
                    <Popconfirm
                        title='确认清空画布吗？'
                        okText='确认'
                        cancelText='取消'
                        onConfirm={clearPage}
                        placement='bottomRight'
                    >
                        <Button size='small' className='text-xs'>
                            清空画布
                        </Button>
                    </Popconfirm>

                    <Button
                        size='small'
                        className='text-xs'
                        type='primary'
                        onClick={previewPage}
                    >
                        预览
                    </Button>
                    <Button
                        onClick={savePage}
                        size='small'
                        className='text-xs'
                        type='primary'
                    >
                        保存
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default Header

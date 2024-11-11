import React, {useRef, useEffect, useState} from 'react'
import {ComponentConfig} from '@/editor/interface'
import {useComponentConfigStore} from '@/editor/stores'

import {Spin} from 'antd'
import Header from './header'
import Material from './material'
import Setting from './setting'
import Stage from './stage'

import './index.css'

const Layout: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const componentConfigRef = useRef<any>({})
    const {setComponentConfig} = useComponentConfigStore()

    useEffect(() => {
        loadComponentConfig()
    }, [])

    // 注册组件
    const registerComponent = (
        name: string,
        componentConfig: ComponentConfig
    ) => {
        componentConfigRef.current[name] = componentConfig
    }

    // 加载组件配置
    const loadComponentConfig = async () => {
        // 加载组件配置模块代码
        const modules = import.meta.glob('../components/*/register.ts', {
            eager: true
        })

        const tasks = Object.values(modules).map((module: any) => {
            if (module?.default) {
                // 执行组件配置里的方法，把注册组件方法传进去
                return module.default({registerComponent})
            }
        })

        // 等待所有组件配置加载完成
        await Promise.all(tasks)
        // 注册组件到全局
        setComponentConfig(componentConfigRef.current)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className='text-center mt-[300px]'>
                <Spin />
            </div>
        )
    }

    return (
        <div className='h-[100vh] flex flex-col bg-[#edeff3]'>
            <div className='flex items-center pb-1 '>
                <Header />
            </div>
            <div className='flex flex-row w-full h-full'>
                <div className='w-[200px] h-full flex-shrink-0'>
                    <Material />
                </div>
                <div className='h-full w-full  p-[16px] flex justify-center content-center'>
                    <Stage />
                </div>
                <div className='w-[200px] h-full flex-shrink-0'>
                    <Setting />
                </div>
            </div>
        </div>
    )
}

export default Layout

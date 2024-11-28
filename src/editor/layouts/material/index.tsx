import React, {useMemo} from 'react'
import ComponentItem from '@/editor/common/component-item'
import {categoryEnum} from '@editor/enum'
import {categoryType} from '@editor/interface'
import {ComponentConfig, ComType} from '@/editor/interface'
import {useComponents, useComponentConfigStore} from '@editor/stores'
import './index.less'

const Material: React.FC = () => {
    const {addComponent, setCurComponentId} = useComponents()
    const {componentConfig} = useComponentConfigStore()

    // 拖拽结束时触发的回调
    const onDragEnd = (dropResult: {
        name: string
        id?: string
        description: string
        props: any
        type: ComType
    }) => {
        const component = {
            id: String(new Date().getTime()),
            name: dropResult.name,
            props: dropResult.props,
            type: dropResult.type,
            description: dropResult.description
        }
        addComponent(component, dropResult.id)
    }

    const onDragStart = () => {
        setCurComponentId(null)
    }

    const components = useMemo(() => {
        // 加载所有组件
        // 格式化组件数据
        // 获取所有可拖拽的组件, 剔除根组件
        const drapableCom = Object.values(componentConfig)
            .map((config: ComponentConfig) => config)
            .filter((conf) => !conf.isRoot)

        const comMap = new Map<categoryType, ComponentConfig[]>()

        // 初始化分类
        Object.keys(categoryEnum).forEach((key) => {
            comMap.set(key as categoryType, [])
        })

        // 按分类进行分组
        drapableCom.forEach((item: ComponentConfig) => {
            if (comMap.has(item.category)) {
                // @ts-ignore
                comMap.get(item.category).push(item)
            }
        })
        return Array.from(comMap)
            .map(([key, value]) => {
                if (value.length === 0) return
                return (
                    <div key={key}>
                        <div className='mb-2 text-xs font-bold text-black text-opacity-60'>
                            {categoryEnum[key]}
                        </div>
                        <div key={key} className='grid grid-cols-2 gap-4'>
                            {value.map((child) => (
                                <ComponentItem
                                    key={child.name}
                                    onDragEnd={onDragEnd}
                                    onDragStart={onDragStart}
                                    {...child}
                                />
                            ))}
                        </div>
                    </div>
                )
            })
            .filter(Boolean)
    }, [componentConfig])

    return (
        <div className='relative p-[10px] flex flex-col gap-2  bg-white h-full'>
            {components}
        </div>
    )
}

export default Material

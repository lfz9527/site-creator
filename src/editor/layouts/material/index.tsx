import React, {useMemo} from 'react'
import ComponentItem from '@/editor/common/component-item'
import {categoryEnum} from '@editor/enum'
import {categoryType} from '@editor/interface'
import {ComponentConfig, ComType} from '@/editor/interface'
import {useComponents, useComponentConfigStore} from '@editor/stores'
import {Collapse} from 'antd'
import type {CollapseProps} from 'antd'
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
        console.log('dropResult.id', dropResult.id)

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
        const com = Object.values(componentConfig)
            .map((config: ComponentConfig) => config)
            .filter((conf) => !conf.isRoot)

        const comMap = new Map<categoryType, ComponentConfig[]>()
        // 按分类进行分组
        com.forEach((item: ComponentConfig) => {
            if (comMap.has(item.category)) {
                // @ts-ignore
                comMap.get(item.category).push(item)
            } else {
                comMap.set(item.category, [item])
            }
        })
        const items: CollapseProps['items'] = []
        for (const [key, value] of comMap) {
            const col = {
                label: categoryEnum[key],
                key: key,
                children: value.map((item, index) => (
                    <div key={item.name + index}>
                        <ComponentItem
                            key={item.name}
                            onDragEnd={onDragEnd}
                            onDragStart={onDragStart}
                            {...item}
                        />
                    </div>
                ))
            }
            items.push(col)
        }

        return items
    }, [componentConfig])

    return (
        <div className='relative flex p-[10px] gap-4 flex-wrap bg-white h-full'>
            <div className='w-full'>
                <Collapse
                    className='w-full'
                    bordered={false}
                    items={components}
                    size='small'
                    defaultActiveKey={[...Object.keys(categoryEnum)]}
                />
            </div>
        </div>
    )
}

export default Material

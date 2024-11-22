import {createElement} from 'react'
import {useComponents, useComponentConfigStore} from '@editor/stores'
import {Component, defaultProps} from '@editor/interface'

const StageContainer = () => {
    const {components} = useComponents()
    const {componentConfig} = useComponentConfigStore()

    // 格式化组件 props
    const formatProps = (component: Component) => {
        const props: {
            [key: string]: any
        } = {}
        component?.props.forEach((item: defaultProps) => {
            const {key, value} = item
            props[key] = value
        })
        return props
    }

    // 渲染组件
    const renderComponents = (components: Component[]): React.ReactNode => {
        return components.map((component: Component) => {
            // 组件不存在，返回 null
            if (!componentConfig[component.name]) {
                return null
            }
            const props = formatProps(component)

            return createElement(
                componentConfig[component.name].component,
                {
                    key: component.id,
                    _id: component.id,
                    _name: component.name,
                    'data-component-id': component.id,
                    ...props
                },
                renderComponents(component.children || [])
            )
        })
    }

    return renderComponents(components)
}

export default StageContainer

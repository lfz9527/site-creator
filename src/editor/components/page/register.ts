import Page from '.'
import {Context} from '@editor/interface'
import {ItemType} from '@editor/item-type'

export default (ctx: Context) => {
    ctx.registerComponent(ItemType.Page, {
        name: ItemType.Page,
        description: '页面',
        icon: '',
        allowDrag: [],
        component: Page,
        comType: 'static',
        isRoot: true,
        category: 'layout',
        defaultProps: [
            {
                key: 'containerId',
                value: 'stage-container'
            }
        ]
    })
}

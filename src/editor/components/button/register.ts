import Button from '.'
import {Context} from '@editor/interface'
import {ItemType} from '@editor/item-type'

export default (ctx: Context) => {
    ctx.registerComponent(ItemType.Button, {
        name: ItemType.Button,
        icon: '',
        description: '按钮',
        component: Button,
        allowDrag: [ItemType.Page, ItemType.Row, ItemType.Col],
        comType: 'static',
        category: 'basic',
        defaultProps: [
            {
                key: 'text',
                value: '按钮'
            }
        ]
    })
}

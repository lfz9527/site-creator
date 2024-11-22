import Col from '.'
import {Context} from '@editor/interface'
import {ItemType} from '@editor/item-type'

export default (ctx: Context) => {
    ctx.registerComponent(ItemType.Col, {
        name: ItemType.Col,
        description: '列布局',
        icon: '',
        allowDrag: [ItemType.Page, ItemType.Row, ItemType.Col],
        component: Col,
        comType: 'static',
        category: 'layout'
    })
}

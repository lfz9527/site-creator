import Row from '.'
import {Context} from '@editor/interface'
import {ItemType} from '@editor/item-type'

export default (ctx: Context) => {
    ctx.registerComponent(ItemType.Row, {
        name: ItemType.Row,
        description: '行布局',
        icon: '',
        allowDrag: [ItemType.Page, ItemType.Row, ItemType.Col],
        component: Row,
        comType: 'static',
        category: 'layout'
    })
}

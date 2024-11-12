import Row from '.'
import {Context} from '@editor/interface'
import {ItemType} from '@editor/item-type'

export default (ctx: Context) => {
    ctx.registerComponent(ItemType.Row, {
        name: ItemType.Row,
        description: '容器',
        icon: '',
        allowDrag: [ItemType.Page, ItemType.Row],
        component: Row,
        comType: 'static',
        category: 'layout'
    })
}

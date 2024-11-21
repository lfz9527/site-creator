import TestCom from '.'
import {Context} from '@editor/interface'
import {ItemType} from '@editor/item-type'

export default (ctx: Context) => {
    ctx.registerComponent(ItemType.TestCom, {
        name: ItemType.TestCom,
        description: '测试组件',
        icon: '',
        allowDrag: [ItemType.Page, ItemType.Row],
        component: TestCom,
        comType: 'static',
        category: 'basic'
    })
}

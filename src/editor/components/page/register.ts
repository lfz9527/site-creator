import Page from ".";
import { Context } from "@editor/interface";
import { ItemType } from "@editor/item-type";

export default (ctx: Context) => {
  ctx.registerComponent(ItemType.Page, {
    name: ItemType.Page,
    desc: "页面",
    allowDrag: [],
    component: Page,
    comType: "static",
    isRoot: true,
  });
};

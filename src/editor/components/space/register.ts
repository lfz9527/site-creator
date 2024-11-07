import Space from ".";
import { Context } from "@editor/interface";
import { ItemType } from "@editor/item-type";

export default (ctx: Context) => {
  ctx.registerComponent(ItemType.Space, {
    name: ItemType.Space,
    desc: "间距",
    allowDrag: [ItemType.Space],
    component: Space,
    comType: "static",
  });
};

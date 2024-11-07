import Button from ".";
import { Context } from "@editor/interface";
import { ItemType } from "@editor/item-type";

export default (ctx: Context) => {
  ctx.registerComponent(ItemType.Button, {
    name: ItemType.Button,
    desc: "按钮",
    component: Button,
    allowDrag: [ItemType.Space],
    comType: "static",
  });
};

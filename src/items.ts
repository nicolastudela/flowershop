import { ITEMS_NAMES, Item } from "./types";

const buildBundleCost = (bundles: [number,number][]) => bundles.map(([units, cost]) => ({ units, cost}))

const ITEM_LIST = [{
  name: ITEMS_NAMES.ROSES,
  code: "R12",
  bundlesOptions: buildBundleCost([[5, 6.99], [10, 12.99],]),
},
{
  name: ITEMS_NAMES.LILIES,
  code: "L09",
  bundlesOptions: buildBundleCost([[3, 9.95], [6, 16.95], [9,24.95]]),
},
{
  name: ITEMS_NAMES.TULIPS,
  code: "T58",
  bundlesOptions: buildBundleCost([[3, 5.95], [5, 9.95], [9, 16.99]]),
}] as Item[];

export default ITEM_LIST;
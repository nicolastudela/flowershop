import fs from "fs";
import itemBundles from "./items";
import {
  Bill,
  BilledItem,
  Item,
  Order,
  OrderItem,
} from "./types";
import calculateBillItemFromOrderItem from "./orderBundeler"

/**
 * Takes an order and calculate costs and bundles necessaries for each item. Also calculates the total amount of the order.
 *
 * @param order  (representing a list of items requested)
 * @param items  The item-products(name, code, bundle) list.
 *  IMPORTANT: The bundles on each product should be desc-sorted by bundle count.
 * @returns bill (representing the bill to be handed to the user detailing counts of bundles and costs)
 */
const invoiceOrder = (order: Order, items: Item[]) => {
  const billedItems: BilledItem[] = order.items.map((orderItem: OrderItem) =>
    calculateBillItemFromOrderItem(orderItem, items)
  );

  return {
    billedItems,
    totalAmount: billedItems.reduce((prev, { cost }) => prev + cost, 0),
  } as Bill;
};

function main(testFilePath: string) {
  // First we sort-desc by bundles units on each item. Its a pre-condition to
  // calculate efficiently bundles-counts when an order arrives.
  // (is expected to do this sorting once at the entirely shop lifecylcle)
  const itemsWithBundlesSortedByUnits = itemBundles.map(
    ({ code, name, bundlesOptions: bundlesCost }: Item) =>
      ({
        code,
        name,
        // warn: it mutates originalBundles
        bundlesOptions: bundlesCost.sort((a, b) => b.units - a.units),
      } as Item)
  );

  // reading tests from file path provided
  const allFileContents =  fs.readFileSync(testFilePath, "utf-8");
  const items = allFileContents.split(/\r?\n/).map(line =>  {
     const splitted = line.split(" "); 
     return {  count: Number.parseInt(splitted[0]), code: splitted[1], } as unknown as OrderItem}
  );

  // logs items read 
  console.log(`Input from ${testFilePath}`);
  console.log(items);

  // actual calculation of the items received
  const bill = invoiceOrder({code: `from ${testFilePath}`, items}, itemsWithBundlesSortedByUnits);

  // logs result
  console.log(`Result for order read in ${testFilePath}`);
  console.log(JSON.stringify(bill, null, 2));
}

main("tests.txt");

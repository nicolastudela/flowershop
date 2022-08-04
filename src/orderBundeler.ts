import createBundleResultGroup, {
  BundleResultGroup,
} from "./bundleResultGroup";
import { Bundle, OrderItem, Item, BilledItem } from "./types";

/**
 * @param orderItem  Requested product & count.
 * @param items  The products[name, code, bundleOptions] list.
 *  IMPORTANT: The bundles on each product should be desc-sorted by bundle count.
 * @returns Requested products bundeled by minimal-bundles count strategy and total cost
 */
const calculateBillItemFromOrderItem = (
  orderItem: OrderItem,
  items: Item[]
): BilledItem => {
  // a cache to not to calculate already calculated solutions
  const resultCache: BundleResultGroup[] = [];

  // this function is where bundle breakdown is done.
  //FIX remove recursion go onto a stack 
  function bestSolution(reqItemCount: number, reqBbundles: Bundle[]) {
    // if there is a already calculated value, we return it instead of recalculate.
    const cached = resultCache[reqItemCount];
    if (cached) {
      return cached;
    }

    // reqBbundles[reqBbundles.length - 1] is the smallest element. If request count is smaller than that value won't be a solution.
    if (
      reqItemCount <= 0 ||
      reqItemCount < reqBbundles[reqBbundles.length - 1].units
    ) {
      return createBundleResultGroup();
    }

    // initialize temporary best result
    let bestMatch = createBundleResultGroup()
    reqBbundles.forEach((bundle) => {
      const temp = bestSolution(reqItemCount - bundle.units, reqBbundles);
      temp.addBundle(bundle);
      // if temporary result is valid and better than last-saved-result, we update it
      if (temp.isBetterGroup(bestMatch) && temp.totalUnits() === reqItemCount) {
        bestMatch = temp;
      }
    });

    resultCache[reqItemCount] = createBundleResultGroup(bestMatch.bundles());

    return bestMatch;
  }

  // find the requested product
  const requestedItem: Item | undefined = items.find(
    (it) => it.code === orderItem.code
  );

  if (requestedItem) {
    const bestMatch = bestSolution(orderItem.count, requestedItem.bundlesOptions);

    return {
      code: orderItem.code,
      cost: bestMatch
        .bundles()
        ?.reduce((prev, curr) => curr.cost * curr.count + prev, 0),
      resultBundles: bestMatch.bundles(),
    } as BilledItem;
  }
  // the item requested was not found on bundleOptions, so return empty billItem
  return {
    code: orderItem.code,
    resultBundles: null,
    cost: 0,
  } as BilledItem;
};


export default calculateBillItemFromOrderItem;
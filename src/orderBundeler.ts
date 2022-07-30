import { ResultBundle, Bundle, OrderItem, Item, BilledItem } from "./types";

/**
 * Represent an intermediate result/match
 */
interface BundleResultGroup {
  bundles: () => ResultBundle[] | null;
  totalUnits: () => number | null;
  bundlesCount: () => number | null;
  addBundle: (arg0: Bundle) => void;
  isBetterGroup: (arg0: BundleResultGroup) => boolean;
}

/**
 * Closure that creates intermediate result/match
 * Encapsulates data by providing methods to update the result 
 */
function createBundleResultGroup() {
  let _bundles: ResultBundle[] | null = null;

  function addBundle(bundle: Bundle) {
    const exist = _bundles?.find(
      (b) => b.units === bundle.units
    );
    if (!exist) {
      if (!_bundles) {
        _bundles = [];
      }
      _bundles.push({ ...bundle, count: 1 });
    } else {
      // warn: mutating
      exist.count = exist.count + 1;
    }
  }

  // not properly encapsulated, we could return a cloned array
  function bundles() {
    return _bundles;
  }
  function bundlesCount() {
    return _bundles ? _bundles?.reduce(( prev, b) => b.count + prev, 0) : null;
  }

  function totalUnits() {
    return _bundles ? _bundles?.reduce(( prev, b) => (b.count * b.units) + prev, 0) : null;
  }

  function isBetterGroup(prev: BundleResultGroup) {
    const currentBundleCount = bundlesCount();
    if (currentBundleCount !== null) {
      const prevBundleCount = prev.bundlesCount();
      if (prevBundleCount === null || currentBundleCount <= prevBundleCount) {
        return true;
      }
    }
    return false;
  }
  
  return {
    addBundle,
    bundles,
    bundlesCount,
    totalUnits,
    isBetterGroup,
    toString() {
      return {
        bundles,
        bundleCount: bundlesCount(),
        totalUnits: totalUnits(),
      }
    }
  } as BundleResultGroup
}

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
  // find the requested product
  const requestedItem: Item | undefined = items.find(
    (it) => it.code === orderItem.code
  );

  if (requestedItem) {
    const bundlesOptions = requestedItem.bundlesOptions;

    // initialize temporary best result
    let bestMatch = createBundleResultGroup();

    let i = 0;
    while (i < bundlesOptions.length) {
      let j = i;
      let rest = orderItem.count;
      const tempMatch = createBundleResultGroup();

      while (j < bundlesOptions.length) {
        if (rest >= bundlesOptions[j].units) {
          tempMatch.addBundle(bundlesOptions[j])
          rest = rest - bundlesOptions[j].units;

          // no need to continue looking for a result if we already have one
          if (rest === 0) {
            break;
          }
        } else {
          j = j + 1;
        }
      }
      
      // if temporary result is valid and better than last-saved-result, we update it
      if (
        tempMatch.totalUnits() === orderItem.count &&
        tempMatch.isBetterGroup(bestMatch)
      ) {
        bestMatch = tempMatch;
      }
      i = i + 1;
    }

    return {
      code: orderItem.code,
      cost: bestMatch.bundles()?.reduce((prev, curr) => (curr.cost * curr.count) + prev, 0),
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
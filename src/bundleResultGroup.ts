import { ResultBundle, Bundle } from "./types";

/**
 * Represent an intermediate result/match
 */
 export interface BundleResultGroup {
  bundles: () => ResultBundle[] | null;
  totalUnits: () => number | null;
  bundlesCount: () => number | null;
  addBundle: (arg0: Bundle) => void;
  isBetterGroup: (arg0: BundleResultGroup) => boolean;
  toString: () => string;
}

/**
 * Closure that creates intermediate result/match
 * Encapsulates data by providing methods to update the result 
 */
export default function createBundleResultGroup(initResultBundles?: ResultBundle[] | null) {
  let _bundles: ResultBundle[] | null = null;

  if (initResultBundles) {
    _bundles = initResultBundles.map((resultBundle: ResultBundle) => ({...resultBundle}))
  }


  function addBundle(bundle: Bundle) {
      let existIdx; 
      if (!_bundles) {
        existIdx = -1
      } else {
        existIdx = _bundles.findIndex(b => b.units === bundle.units);
      }
      if (existIdx < 0) {
        if (!_bundles) {
          _bundles = [];
        }
        _bundles.push({ ...bundle, count: 1 });
      } else {
        if (_bundles) {
          _bundles[existIdx] = {..._bundles[existIdx], count: _bundles[existIdx].count + 1}
        }
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
      return JSON.stringify({
        bundles,
        bundleCount: bundlesCount(),
        totalUnits: totalUnits(),
      }, null, 2)
    }
  } as BundleResultGroup
}
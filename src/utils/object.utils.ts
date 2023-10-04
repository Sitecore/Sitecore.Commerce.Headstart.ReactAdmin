import {get, isArray, isEqual, isObject, set} from "lodash"

/**
 * Returns an object that has only properties where the value has changed
 *
 * @param oldObj The original object to be compared
 * @param newObj The new object with updates
 */
export function getObjectDiff(oldObj = {}, newObj = {}) {
  const diff = {}
  const diffKeys = getObjectDiffKeys(oldObj, newObj)
  if (!diffKeys?.length) {
    return diff
  }
  diffKeys.forEach((diffKey) => {
    const value = get(newObj, diffKey, null)
    set(diff, diffKey, value)
  })
  return diff
}

/**
 * Returns the keys of an object that have changed
 *
 * @param oldObj The original object to be compared
 * @param newObj The new object with updates
 */
function getObjectDiffKeys(oldObj = {}, newObj = {}) {
  return Object.keys(newObj || {}).reduce((result, key) => {
    const inner1 = oldObj[key]
    const inner2 = newObj[key]
    if (!isEqual(inner1, inner2)) {
      if (isObject(inner2) && isObject(inner1) && !isArray(inner2)) {
        const innerDiffKeys = getObjectDiffKeys(oldObj[key] || {}, newObj[key] || {}).map(
          (innerKey) => `${key}.${innerKey}`
        )
        result = result.concat(innerDiffKeys)
      } else {
        result.push(key)
      }
    }
    return result
  }, [])
}

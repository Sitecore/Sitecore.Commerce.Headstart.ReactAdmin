import {get, isArray, isEqual, isObject, set} from "lodash"

/**
 * Returns an object that has only properties where the value has changed
 *
 * @param obj1 The original object to be compared
 * @param obj2 The original object with updates
 */
export function getObjectDiff(obj1, obj2) {
  const diff = {}
  const diffKeys = getObjectDiffKeys(obj1, obj2)
  if(!diffKeys?.length) {
    return diff;
  }
  diffKeys.forEach((diffKey) => {
    const value = get(obj2, diffKey, null)
    set(diff, diffKey, value)
  })
  return diff
}

function getObjectDiffKeys(obj1, obj2) {
  return Object.keys(obj2 || {}).reduce((result, key) => {
    const inner1 = obj1[key]
    const inner2 = obj2[key]
    if (!isEqual(inner1, inner2)) {
      if (isObject(inner2) && !isArray(inner2)) {
        const innerDiffKeys = getObjectDiffKeys(obj1[key] || {}, obj2[key] || {}).map(
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

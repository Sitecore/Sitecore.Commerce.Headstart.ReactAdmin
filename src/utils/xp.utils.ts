/*
OrderCloud API return a nested object with xp(Extended properties).
In some case we need to flatten the object for easier access/use and binding with Forms Models for example or Map rendering functions. 
In the form validation schema we need the object key name to be like xp_propName and not xp.propName.
*/

export const xpHelper = {
  flattenXpObject,
  unflattenXpObject
}

function flattenXpObject(ob: object, separator: string): object {
  let result = {}
  for (const i in ob) {
    if (typeof ob[i] === "object" && ob[i] !== null && !Array.isArray(ob[i])) {
      const temp = flattenXpObject(ob[i], separator)
      for (const j in temp) {
        result[i + separator + j] = temp[j]
      }
    } else {
      if (ob[i] === undefined || ob[i] === null) {
        // without setting undefined or null to an empty string
        // the previous value on the form (if defined) will persist
        // this ensures the previous value is cleared out
        result[i] = ""
      } else {
        result[i] = ob[i]
      }
    }
  }
  return result
}

function unflattenXpObject(ob: object, separator: string): object {
  var result = {}
  let data = Object.assign({}, ob)
  for (const i in data) {
    var keys = i.split(separator)
    keys.reduce(function (r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
    }, result)
  }
  return result
}

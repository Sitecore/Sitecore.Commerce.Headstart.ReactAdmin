import {RuleGroupTypeAny, ValidationMap} from "react-querybuilder"
import {validator} from "./validator"

export function isQueryValid(query: RuleGroupTypeAny, isLineItemLeveL: boolean) {
  let validationMap: ValidationMap = {} // holds all validation results

  if (typeof validator === "function") {
    const validationResult = validator(query, isLineItemLeveL)
    if (typeof validationResult === "boolean") {
      if (validationResult === false) {
        // not valid, we can bail early
        return false
      }
    } else {
      validationMap = validationResult
    }
  }

  return Object.values(validationMap).every((validationResult) => {
    if (typeof validationResult === "boolean") {
      return validationResult
    } else {
      return validationResult.valid
    }
  })
}

import {RuleType, RuleGroupTypeAny, ValidationMap, ValidationResult} from "react-querybuilder"
import {combinators} from "./combinators"

export const validator = (query: RuleGroupTypeAny, isLineItemLevel: boolean): boolean | ValidationMap => {
  const result: ValidationMap = {}

  validateGroup(query, result, isLineItemLevel)

  return result
}

function validateGroup(group: RuleGroupTypeAny, result: ValidationMap, isLineItemLevel: boolean) {
  const reasons: any[] = []
  if (group.rules.length === 0) {
    reasons.push({code: "empty", message: "Groups must have at least one rule"})
  } else if (!("combinator" in group)) {
    // Odd indexes should be valid combinators and even indexes should be rules or groups
    let invalidICs = false
    for (let i = 0; i < group.rules.length && !invalidICs; i++) {
      if (
        (i % 2 === 0 && typeof group.rules[i] === "string") ||
        (i % 2 === 1 && typeof group.rules[i] !== "string") ||
        (i % 2 === 1 &&
          typeof group.rules[i] === "string" &&
          !combinators.map((c) => c.name as string).includes(group.rules[i] as string))
      ) {
        invalidICs = true
      }
    }
    if (invalidICs) {
      reasons.push({code: "invalidIndependentCombinator", message: "Invalid independent combinator"})
    }
  }

  // Note: combinators are considered rules, thats why we are checking 3 instead of 2
  if (group["operator"] === "min" && group.rules.length !== 3) {
    reasons.push({code: "min", message: "Min must have exactly two rules"})
  }

  // Note: combinators are considered rules, thats why we are checking 3 instead of 2
  if (group["operator"] === "max" && group.rules.length !== 3) {
    reasons.push({code: "max", message: "Max must have exactly two rules"})
  }

  if (group.id) {
    if (reasons.length) {
      result[group.id] = {valid: false, reasons}
    } else {
      result[group.id] = true
    }
  }
  group.rules.forEach((r) => {
    if (typeof r === "string") {
      // Validation for this case was done earlier
    } else if ("rules" in r) {
      validateGroup(r, result, isLineItemLevel)
    } else {
      validateRule(r, group, result, isLineItemLevel)
    }
  })
}

function validateRule(rule: RuleType, group: RuleGroupTypeAny, result: ValidationMap, isLineItemLevel: boolean) {
  const reasons: any[] = []

  if (!isLineItemLevel) {
    if (rule["modelPath"].startsWith("LineItem.") && !group["operator"]?.startsWith("items.")) {
      reasons.push({
        code: "lineItemFieldWithoutItemsGroup",
        message:
          "LineItems, Products, Variants, and ShippingAddresses must use the line item group operators OR promotion must be set to line item level"
      })
    }

    if (group["operator"]?.startsWith("items.") && !rule["modelPath"].startsWith("LineItem")) {
      reasons.push({
        code: "invalidFieldForItemsGroup",
        message:
          "The line item group operators can only be used with LineItem, Product, Variant, and ShippingAddress fields"
      })
    }
  }

  if (!rule.operator) {
    reasons.push({code: "empty", message: "Rule must have an operator"})
  }
  if (rule.value == "undefined" && rule.operator !== "value") {
    reasons.push({code: "empty", message: "Rule must have a value"})
  }
  if (rule.value === "" && rule.operator !== "value") {
    reasons.push({code: "empty", message: "Rule must have a value"})
  }

  if (rule.id) {
    if (reasons.length) {
      result[rule.id] = {valid: false, reasons}
    } else {
      result[rule.id] = true
    }
  }
}

export function isInvalid(validation: boolean | ValidationResult) {
  if (typeof validation === "boolean") {
    return !validation
  }
  return !validation.valid
}

export function getValidationMessage(validation: boolean | ValidationResult): string {
  if (!validation) {
    return ""
  }
  if (typeof validation === "boolean" || validation.valid) {
    // our custom validation should never return a boolean
    return ""
  }
  return validation.reasons[0].message
}

export function getValidationCode(validation: boolean | ValidationResult): string {
  if (typeof validation === "boolean" || validation.valid) {
    // our custom validation should never return a boolean
    return ""
  }
  return validation.reasons[0].code
}

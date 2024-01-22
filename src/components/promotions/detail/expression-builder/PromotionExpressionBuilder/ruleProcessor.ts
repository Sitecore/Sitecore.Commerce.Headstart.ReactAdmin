import {RuleGroupTypeIC, RuleType, ValueProcessorOptions, trimIfString} from "react-querybuilder"
import {OperatorName} from "./operators"

interface CustomRuleType extends RuleType {
  operator: OperatorName
}
type CustomRuleProcessor = (rule: CustomRuleType, ruleGroup: RuleGroupTypeIC, options: ValueProcessorOptions) => any

export const ruleProcessor: CustomRuleProcessor = (
  {field, operator, value, valueSource},
  rg,
  {escapeQuotes, parseNumbers}
) => {
  const groupOperator = rg["operator"]
  const valueIsField = valueSource === "field"
  const useBareValue =
    typeof value === "boolean" || typeof value == "number" || shouldRenderAsNumber(value, parseNumbers)

  let formattedValue: string
  if (valueIsField || useBareValue) {
    formattedValue = value as string
  } else {
    formattedValue = `'${escapeSingleQuotes(value, escapeQuotes)}'`
  }

  let formattedField = field
  if (field.includes("LineItem.")) {
    formattedField = field.replace("LineItem.", "")
    if (!groupOperator?.startsWith("items.")) {
      formattedField = `item.${formattedField}`
    }
  }

  // Product category function is special case
  if (formattedField === "item.Product.Category") {
    return `item.product.incategory(${formattedValue})`
  }
  if (formattedField === "Product.Category") {
    return `product.incategory(${formattedValue})`
  }

  // handle raw value, we don't want to show operator or field
  if (field.startsWith(".")) {
    return formattedValue
  }

  switch (operator) {
    case "<":
    case "<=":
    case "=":
    case ">":
    case ">=":
    case "+":
    case "-":
    case "/":
    case "*":
      return `${formattedField} ${operator} ${formattedValue}`

    case "value":
      return field

    case "containsText":
    case "containsNumber":
      return `${formattedField}.${operator}(${formattedValue})`

    case "in":
      return `${formattedField}.${operator}(${value
        .split(",")
        .map((v) => `'${v}'`)
        .join(", ")})`

    case "any":
    case "all":
    case "countWithCriteria":
      return `${formattedField}.${operator.replace("WithCriteria", "")}(item = ${formattedValue})`

    case "count":
      return `${formattedField}.${operator}()`
  }

  return "NOT_IMPLEMENTED"
}

/**
 * Helper functions
 */

const numericRegex = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/

function shouldRenderAsNumber(v: any, parseNumbers?: boolean) {
  return (
    parseNumbers && (typeof v === "number" || typeof v === "bigint" || (typeof v === "string" && numericRegex.test(v)))
  )
}

function escapeSingleQuotes(v: any, escapeQuotes?: boolean) {
  return typeof v !== "string" || !escapeQuotes ? v : v.replaceAll(`'`, `\\'`)
}

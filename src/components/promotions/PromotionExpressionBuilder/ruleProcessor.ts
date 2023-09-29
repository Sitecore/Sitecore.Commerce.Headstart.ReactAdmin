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

  let formattedField: string
  if (groupOperator?.startsWith("items.")) {
    // OrderCloud's items. functions expect line item properties
    formattedField = field.replace("LineItem.", "")
  } else {
    formattedField = field
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
    case "in":
      return `${formattedField} ${operator} ${formattedValue}`

    case "value":
      return field
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

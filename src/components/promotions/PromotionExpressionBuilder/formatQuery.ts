import {
  Field,
  RuleGroupTypeIC,
  RuleType,
  RuleValidator,
  ValidationMap,
  ValidationResult,
  isRuleOrGroupValid
} from "react-querybuilder"
import {ruleProcessor} from "./ruleProcessor"
import {validator} from "./validator"

// Takes in a react-query-builder query and returns an ordercloud promotion expression
// Modified from react-query-builder's formatQuery function
// https://github.com/react-querybuilder/react-querybuilder/blob/main/packages/react-querybuilder/src/utils/formatQuery/formatQuery.ts
interface FormatQueryOptions {
  fields: Field[]
}
export function formatQuery(ruleGroup: RuleGroupTypeIC, {fields}: FormatQueryOptions = {fields: []}) {
  const placeholderFieldName = "~"
  const placeholderOperatorName = "~"
  const fallbackExpression = "" // used as a fallback when a rule is invalid
  let validationMap: ValidationMap = {} // holds all validation results

  if (typeof validator === "function") {
    const validationResult = validator(ruleGroup)
    if (typeof validationResult === "boolean") {
      if (validationResult === false) {
        return fallbackExpression
      }
    } else {
      validationMap = validationResult
    }
  }

  const validatorMap: Record<string, RuleValidator> = {}
  fields.forEach((field) => {
    if (typeof field.validator === "function") {
      validatorMap[field.name] = field.validator
    }
  })

  return processRuleGroup(ruleGroup, true)

  function processRuleGroup(rg: RuleGroupTypeIC, outermost?: boolean) {
    if (!isRuleOrGroupValid(rg, validationMap[rg.id ?? ""])) {
      return outermost ? fallbackExpression : ""
    }

    const expression: string = rg.rules
      .map((rule) => {
        if (typeof rule === "string") {
          return rule
        }
        if ("rules" in rule) {
          return processRuleGroup(rule)
        }
        const [validationResult, fieldValidator] = validateRule(rule)
        if (
          !isRuleOrGroupValid(rule, validationResult, fieldValidator) ||
          rule.field === placeholderFieldName ||
          rule.operator === placeholderOperatorName
        ) {
          return fallbackExpression
        }
        return ruleProcessor(rule, rg, {
          parseNumbers: false, // represent numbers without quotes
          escapeQuotes: (rule.valueSource ?? "value") === "value"
        })
      })
      .filter(Boolean)
      .join("combinator" in rg ? ` ${rg.combinator} ` : " ")

    const [prefix, suffix] = getPrefixSuffix(rg, outermost)

    return expression ? `${prefix}${expression}${suffix}` : fallbackExpression

    function getPrefixSuffix(rg: RuleGroupTypeIC, outermost?: boolean) {
      const operator = rg["operator"]
      if (operator) {
        return [`${operator}(`, `)`]
      }
      if (outermost) {
        return ["", ""]
      }
      return [`(`, `)`]
    }
  }

  function validateRule(rule: RuleType) {
    let validationResult: boolean | ValidationResult | undefined = undefined
    let fieldValidator: RuleValidator | undefined = undefined
    if (rule.id) {
      validationResult = validationMap[rule.id]
    }
    if (fields.length) {
      const fieldArr = fields.filter((f) => f.name === rule.field)
      if (fieldArr.length) {
        const field = fieldArr[0]
        // istanbul ignore else
        if (typeof field.validator === "function") {
          fieldValidator = field.validator
        }
      }
    }

    return [validationResult, fieldValidator] as const
  }
}

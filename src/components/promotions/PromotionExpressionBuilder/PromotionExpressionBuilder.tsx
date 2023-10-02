import {TextareaControl} from "@/components/react-hook-form"
import {Card, Text, FormLabel, SimpleGrid, VStack, Box} from "@chakra-ui/react"
import {QueryBuilderChakra} from "@react-querybuilder/chakra"
import {usePromoExpressions} from "hooks/usePromoExpressions"
import {useEffect, useRef, useState} from "react"
import {useController} from "react-hook-form"
import {QueryBuilder, RuleGroupTypeIC} from "react-querybuilder"
import {combinators} from "./combinators"
import {CustomAddRuleAction} from "./components/CustomAddRuleAction"
import {CustomCombinatorSelector} from "./components/CustomCombinatorSelector"
import {CustomFieldSelector} from "./components/CustomFieldSelector"
import {CustomOperatorSelector} from "./components/CustomOperatorSelector"
import {CustomRemoveGroupAction} from "./components/CustomRemoveGroupAction"
import {CustomAddGroupAction} from "./components/CustomAddGroupAction"
import {CustomRemoveRuleAction} from "./components/CustomRemoveRuleAction"
import {CustomValueEditor} from "./components/CustomValueEditor"
import {formatQuery} from "./formatQuery"
import {isQueryValid} from "./isAllValid"
import {operators} from "./operators"
import {getValidationMessage, validator} from "./validator"

interface PromotionExpressionBuilderProps {
  expressionType: "Value" | "Eligible"
  control: any
  validationSchema: any
}
export function PromotionExpressionBuilder({
  control,
  validationSchema,
  expressionType
}: PromotionExpressionBuilderProps) {
  const initalQuery: RuleGroupTypeIC = {rules: []}
  const [query, setQuery] = useState(initalQuery)
  const {fields} = usePromoExpressions()
  const {field} = useController({
    control,
    name: `${expressionType}Expression`
  })
  const {field: validation} = useController({control, name: `${expressionType}ExpressionValid`})
  useEffect(() => {
    validation.onChange(isQueryValid(query))
  }, [query, validation])

  const handleQueryChange = (q) => {
    validation.onChange(isQueryValid(query))
    setQuery(q)
    field.onChange(formatQuery(q))
  }

  if (!fields) return null
  return (
    <>
      <FormLabel>{expressionType} Expression</FormLabel>
      <VStack
        _first={{mb: 6}}
        id="vstack-wrapper"
        width="full"
        alignItems="stretch"
        sx={{
          "& > .queryBuilder > .ruleGroup": {padding: 3},
          "& > .queryBuilder > .queryBuilder-invalid": {
            backgroundColor: "rgb(225, 40, 30, .1)",
            borderColor: "danger"
          },
          "& > .queryBuilder > .ruleGroup > .ruleGroup-body > .rule": {
            rounded: "md",
            padding: 3,
            borderColor: "danger"
          }
        }}
        // sx={{"& > .queryBuilder > .ruleGroup": {bgColor: "rgba(51, 55, 204, .2)"}}}
      >
        <QueryBuilderChakra>
          <QueryBuilder
            fields={fields}
            independentCombinators={true}
            combinators={combinators}
            query={query}
            context={{query, handleQueryChange}}
            onQueryChange={handleQueryChange}
            onAddRule={(rule, parentPath, query, context) => {
              // add the modelPath to the rule so we can filter the fields in the fieldSelector
              rule["modelPath"] = context.modelPath
              rule["modelName"] = context.modelName

              // set the field to the first field in the list
              rule.field = fields.find((f) => f["modelPath"] === context.modelPath)?.name
              return rule
            }}
            onAddGroup={(group, parentPath, query, context) => {
              group.rules = [] // clear out rules, we want to force them to pick an entity first so we can filter fields/operators accordingly
              return group
            }}
            getOperators={(fieldName) => {
              if (fieldName.includes(".xp.")) {
                // xp could be any type, so give them all of the operators
                return operators
              }

              // Get relevant operators based on field type
              const split = fieldName.split(".")
              const name = split[split.length - 1]
              const modelPath = split.slice(0, split.length - 1).join(".")
              const definition = fields.find((f) => f.name === `${modelPath}.${name}`)
              if (!definition) {
                throw new Error("no definition found for field: " + fieldName)
              }
              const inputType = definition.inputType
              switch (inputType) {
                case "number":
                  return operators.filter((o) => o.category.includes("number"))
                case "datetime-local":
                  return operators.filter((o) => o.category.includes("date"))
                case "text":
                  return operators.filter((o) => o.category.includes("string"))
              }
              return operators
            }}
            addRuleToNewGroups
            showCombinatorsBetweenRules
            controlElements={{
              addRuleAction: CustomAddRuleAction,
              addGroupAction: CustomAddGroupAction,
              fieldSelector: CustomFieldSelector,
              valueEditor: CustomValueEditor,
              combinatorSelector: CustomCombinatorSelector,
              operatorSelector: CustomOperatorSelector,
              removeRuleAction: CustomRemoveRuleAction,
              removeGroupAction: CustomRemoveGroupAction
            }}
            validator={validator}
          />
        </QueryBuilderChakra>
      </VStack>
    </>
  )
}

import {QueryBuilder, RuleGroupTypeIC, findPath, update} from "react-querybuilder"
import {QueryBuilderChakra} from "@react-querybuilder/chakra"
import {CustomAddRuleAction} from "./components/CustomAddRuleAction"
import {usePromoExpressions} from "hooks/usePromoExpressions"
import {CustomFieldSelector} from "./components/CustomFieldSelector"
import {useEffect, useState} from "react"
import {CustomValueEditor} from "./components/CustomValueEditor"
import {validator} from "./validator"
import {CustomCombinatorSelector} from "./components/CustomCombinatorSelector"
import {combinators} from "./combinators"
import {operators} from "./operators"
import {formatQuery} from "./formatQuery"
import {FormLabel, VStack} from "@chakra-ui/react"
import {TextareaControl} from "@/components/react-hook-form"
import {useController} from "react-hook-form"
import {CustomOperatorSelector} from "./components/CustomOperatorSelector"
import {isQueryValid} from "./isAllValid"

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
    <VStack width="full" display="flex" alignItems="stretch" marginBottom={3}>
      <FormLabel>{expressionType} Expression</FormLabel>
      <TextareaControl
        name={`${expressionType}Expression`}
        control={control}
        validationSchema={validationSchema}
        isDisabled={true}
        textareaProps={{rows: 1}}
      />
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
            fieldSelector: CustomFieldSelector,
            valueEditor: CustomValueEditor,
            combinatorSelector: CustomCombinatorSelector,
            operatorSelector: CustomOperatorSelector
          }}
          validator={validator}
        />
      </QueryBuilderChakra>
    </VStack>
  )
}

import {FormControl, FormErrorMessage, FormLabel, Input, Tooltip, VStack} from "@chakra-ui/react"
import {QueryBuilderChakra} from "@react-querybuilder/chakra"
import {usePromoExpressions} from "hooks/usePromoExpressions"
import {useEffect} from "react"
import {Control, useController} from "react-hook-form"
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
import {validator} from "./validator"
import {InfoOutlineIcon} from "@chakra-ui/icons"
import {PromotionDetailFormFields} from "../../PromotionDetail"
import {InputControl} from "@/components/react-hook-form"
import {IPromotion} from "types/ordercloud/IPromotion"

interface PromotionExpressionBuilderProps {
  control: Control<PromotionDetailFormFields>
  validationSchema: any
  expressionType: "Value" | "Eligible"
  query: RuleGroupTypeIC
  setQuery: (query: RuleGroupTypeIC) => void
  isDisabled?: boolean
  promotion?: IPromotion
}
export function PromotionExpressionBuilder({
  control,
  validationSchema,
  expressionType,
  query,
  setQuery,
  isDisabled,
  promotion
}: PromotionExpressionBuilderProps) {
  const {fields} = usePromoExpressions()

  const {
    field: {value: isLineItemLevelPromo}
  } = useController({control, name: "Promotion.LineItemLevel"})

  const {field} = useController({
    control,
    name: `Promotion.${expressionType}Expression`
  })
  const {
    field: validation,
    fieldState: {error: validationError}
  } = useController({control, name: `Promotion.${expressionType}ExpressionValid`})

  useEffect(() => {
    const isValid = isQueryValid(query, isLineItemLevelPromo)
    validation.onChange(isValid)
  }, [query, validation, isLineItemLevelPromo])

  useEffect(() => {
    const formattedQuery = formatQuery(query, isLineItemLevelPromo)
    field.onChange(formattedQuery)
  }, [query, field, isLineItemLevelPromo])

  if (!fields) return null
  return (
    <>
      <FormControl isInvalid={Boolean(validationError?.message)}>
        <FormLabel>
          {expressionType} Expression{" "}
          <Tooltip
            label={
              expressionType === "Eligible"
                ? "The condition for whether a promotion can be applied to a cart. Should evaluate to either true or false."
                : "The amount to be subtracted from the subtotal. Should evaluate to a number"
            }
            placement="right"
            aria-label={`Tooltip for ${expressionType}Expression`}
          >
            <InfoOutlineIcon fontSize="sm" color="gray.600" />
          </Tooltip>
        </FormLabel>
        <FormErrorMessage>
          <InfoOutlineIcon marginRight={2} />
          {validationError?.message}
        </FormErrorMessage>
      </FormControl>

      {promotion && promotion[`${expressionType}Expression`] ? (
        !query.rules.length && <Input value={promotion[`${expressionType}Expression`]} isDisabled={true} />
      ) : (
        <InputControl
          name={`Promotion.${expressionType}Expression`}
          label=""
          control={control}
          validationSchema={validationSchema}
          isDisabled={true}
        />
      )}

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
          "& > .queryBuilder-invalid > .ruleGroup > .ruleGroup-body > .rule": {
            rounded: "md",
            padding: 3,
            borderColor: "danger"
          }
        }}
      >
        <QueryBuilderChakra>
          <QueryBuilder
            fields={fields}
            independentCombinators={true}
            combinators={combinators}
            query={query}
            context={{query, setQuery, isLineItemLevelPromo, isDisabled, expressionType}}
            onQueryChange={setQuery}
            onAddRule={(rule, parentPath, query, context) => {
              // add the modelPath to the rule so we can filter the fields in the fieldSelector
              rule["modelPath"] = context.modelPath
              rule["modelName"] = context.modelName

              if (context["groupOperator"] === "min" || context["groupOperator"] === "max") {
                // For min/max we always want the ',' operator
                rule.combinatorPreceding = ","
              }

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

              if (fieldName === "LineItem.Product.Category") {
                // Category is a special case, we only want to allow =
                return operators.filter((o) => o.name === "=")
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
                  return operators.filter((o) => o.appliesTo.includes("number"))
                case "datetime-local":
                  return operators.filter((o) => o.appliesTo.includes("date"))
                case "text":
                  return operators.filter((o) => o.appliesTo.includes("string"))
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
            validator={(query) => validator(query, isLineItemLevelPromo)}
          />
        </QueryBuilderChakra>
      </VStack>
    </>
  )
}

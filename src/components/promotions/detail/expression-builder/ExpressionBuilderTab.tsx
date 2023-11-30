import {SwitchControl} from "@/components/react-hook-form"
import {VStack} from "@chakra-ui/react"
import {Control, useController} from "react-hook-form"
import {PromotionExpressionBuilder} from "./PromotionExpressionBuilder/PromotionExpressionBuilder"
import {PromotionRecipesSelect} from "./PromotionRecipes/PromotionRecipesSelect"
import {RuleGroupTypeIC} from "react-querybuilder"
import {PromotionDetailFormFields} from "../PromotionDetail"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import {IPromotion} from "types/ordercloud/IPromotion"

interface ExpressionBuilderTabProps {
  control: Control<PromotionDetailFormFields>
  validationSchema: any
  initialQuery: RuleGroupTypeIC
  promotion?: IPromotion
}
export function ExpressionBuilderTab({control, validationSchema, initialQuery, promotion}: ExpressionBuilderTabProps) {
  const isPromotionManager = useHasAccess(appPermissions.PromotionManager)
  const {
    field: {onChange: setEligibleExpressionQuery, value: eligibleExpressionQuery}
  } = useController({control, name: "Promotion.xp.eligibleExpressionQuery"})

  const {
    field: {onChange: setValueExpressionQuery, value: valueExpressionQuery}
  } = useController({control, name: "Promotion.xp.valueExpressionQuery"})

  const {
    field: {onChange: setIsLineItemLevel}
  } = useController({control, name: "Promotion.LineItemLevel"})

  const handlePromoRecipeChange = (
    eligibleExpressionQuery: any,
    valueExpressionQuery: any,
    isLineItemLevel: boolean
  ) => {
    setEligibleExpressionQuery(eligibleExpressionQuery)
    setValueExpressionQuery(valueExpressionQuery)
    setIsLineItemLevel(isLineItemLevel)
  }

  return (
    <VStack gap={3} marginTop={3}>
      <PromotionRecipesSelect onChange={handlePromoRecipeChange} />
      <SwitchControl
        name="Promotion.LineItemLevel"
        label="Line Item Level"
        control={control}
        validationSchema={validationSchema}
        tooltipText="Whether this promotion should be applied to individual line items, as opposed to the entire order."
        isDisabled={!isPromotionManager}
      />
      <PromotionExpressionBuilder
        expressionType="Eligible"
        control={control}
        validationSchema={validationSchema}
        query={eligibleExpressionQuery || initialQuery}
        setQuery={setEligibleExpressionQuery}
        isDisabled={!isPromotionManager}
        promotion={promotion}
      />
      <PromotionExpressionBuilder
        expressionType="Value"
        control={control}
        validationSchema={validationSchema}
        query={valueExpressionQuery || initialQuery}
        setQuery={setValueExpressionQuery}
        isDisabled={!isPromotionManager}
        promotion={promotion}
      />
    </VStack>
  )
}

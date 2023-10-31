import {SwitchControl, InputControl} from "@/components/react-hook-form"
import {VStack} from "@chakra-ui/react"
import {Control} from "react-hook-form"
import {PromotionDetailFormFields} from "../PromotionDetail"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface ApplicationRulesTabProps {
  control: Control<PromotionDetailFormFields>
  validationSchema: any
}
export function ApplicationRulesTab({control, validationSchema}: ApplicationRulesTabProps) {
  const isPromotionManager = useHasAccess(appPermissions.PromotionManager)
  return (
    <VStack gap={3} marginTop={3}>
      <SwitchControl
        name="Promotion.AllowAllBuyers"
        label="Allow all buyers"
        control={control}
        validationSchema={validationSchema}
        tooltipText="If enabled, this promotion will be available to all buyer users. If disabled, you will need to assign this promotion to specific buyers or usergroups."
        isDisabled={!isPromotionManager}
      />
      <SwitchControl
        name="Promotion.AutoApply"
        label="Auto apply"
        control={control}
        validationSchema={validationSchema}
        tooltipText="Whether or not this promotion should be auto-applied instead of requiring the user to enter a code."
        isDisabled={!isPromotionManager}
      />
      <SwitchControl
        name="Promotion.LineItemLevel"
        label="Line Item Level"
        control={control}
        validationSchema={validationSchema}
        tooltipText="Whether this promotion should be applied to individual line items, as opposed to the entire order."
        isDisabled={!isPromotionManager}
      />
      <InputControl
        alignSelf="flex-start"
        maxW="xs"
        name="Promotion.Priority"
        label="Priority"
        inputProps={{type: "number", inputMode: "numeric", placeholder: "123"}}
        control={control}
        validationSchema={validationSchema}
        tooltipText="Lets you specify the order in which promotions are applied. Promotions with a higher priority (lower number) will be applied first. This is useful when using auto-applied promotions"
        isDisabled={!isPromotionManager}
      />
    </VStack>
  )
}

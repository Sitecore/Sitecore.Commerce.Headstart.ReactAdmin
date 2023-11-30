import {SwitchControl, InputControl} from "@/components/react-hook-form"
import {VStack, HStack} from "@chakra-ui/react"
import {Control, useWatch} from "react-hook-form"
import {PromotionDetailFormFields} from "../PromotionDetail"
import DatePickerLocalControl from "@/components/react-hook-form/date-picker-local-control"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface UsageLimitsTabProps {
  control: Control<PromotionDetailFormFields>
  validationSchema: any
  isCreatingNew: boolean
}
export function UsageLimitsTab({control, validationSchema, isCreatingNew}: UsageLimitsTabProps) {
  const isPromotionManager = useHasAccess(appPermissions.PromotionManager)
  return (
    <VStack gap={3} marginTop={3} maxW="container.lg">
      <SwitchControl
        name="Promotion.CanCombine"
        label="Can combine"
        control={control}
        validationSchema={validationSchema}
        tooltipText="Whether or not this promotion can be combined with other promotions."
        isDisabled={!isPromotionManager}
      />
      <HStack w="full">
        <DatePickerLocalControl
          name="Promotion.StartDate"
          label="Start Date"
          control={control}
          validationSchema={validationSchema}
          type="date-time"
          isDisabled={!isPromotionManager}
        />
        <DatePickerLocalControl
          name="Promotion.ExpirationDate"
          label="End Date"
          control={control}
          validationSchema={validationSchema}
          type="date-time"
          isDisabled={!isPromotionManager}
        />
      </HStack>

      <InputControl
        name="Promotion.RedemptionLimit"
        label="Redemption limit"
        inputProps={{type: "number"}}
        control={control}
        validationSchema={validationSchema}
        tooltipText="The maximum number of times this promotion can be redeemed across all users"
        isDisabled={!isPromotionManager}
      />
      <InputControl
        name="Promotion.RedemptionLimitPerUser"
        label="Redemption limit per user"
        inputProps={{type: "number"}}
        control={control}
        validationSchema={validationSchema}
        tooltipText="The maximum number of times this promotion can be redeemed by a single user."
        isDisabled={!isPromotionManager}
      />
      {!isCreatingNew && (
        <InputControl
          name="Promotion.RedemptionCount"
          label="Redemption count"
          control={control}
          validationSchema={validationSchema}
          isDisabled={true}
        />
      )}
    </VStack>
  )
}

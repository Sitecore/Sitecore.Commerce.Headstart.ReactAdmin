import {Control, FieldValues, UseFormTrigger, useFieldArray} from "react-hook-form"
import {SinglePricingForm} from "./SinglePricingForm"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {PriceOverrideForm} from "./PriceOverrideForm"
import {appPermissions} from "constants/app-permissions.config"

interface PricingFormProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
  overridePriceSchedules?: IPriceSchedule[]
}
export function PricingForm({control, trigger, priceBreakCount, overridePriceSchedules}: PricingFormProps) {
  const fieldArray = useFieldArray({
    control,
    name: `OverridePriceSchedules`
  })
  return (
    <>
      <SinglePricingForm
        fieldNamePrefix="DefaultPriceSchedule"
        control={control}
        trigger={trigger}
        priceBreakCount={priceBreakCount}
      />
      <ProtectedContent hasAccess={appPermissions.BuyerManager}>
        <PriceOverrideForm control={control} fieldArray={fieldArray} overridePriceSchedules={overridePriceSchedules} />
      </ProtectedContent>
    </>
  )
}

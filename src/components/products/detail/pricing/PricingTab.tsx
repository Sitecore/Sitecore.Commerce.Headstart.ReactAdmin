import {Control, UseFormTrigger, useFieldArray} from "react-hook-form"
import {PriceForm} from "./PriceForm"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {PriceOverrideForm} from "./PriceOverrideForm"
import {appPermissions} from "constants/app-permissions.config"
import {ProductDetailFormFields} from "../form-meta"

interface PricingTabProps {
  control: Control<ProductDetailFormFields>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
  overridePriceSchedules?: IPriceSchedule[]
}
export function PricingTab({control, trigger, priceBreakCount, overridePriceSchedules}: PricingTabProps) {
  const fieldArray = useFieldArray({
    control,
    name: `OverridePriceSchedules`
  })
  return (
    <>
      <PriceForm
        fieldNamePrefix="DefaultPriceSchedule"
        control={control as any}
        trigger={trigger}
        priceBreakCount={priceBreakCount}
      />
      <ProtectedContent hasAccess={appPermissions.BuyerManager}>
        <PriceOverrideForm control={control} fieldArray={fieldArray} overridePriceSchedules={overridePriceSchedules} />
      </ProtectedContent>
    </>
  )
}

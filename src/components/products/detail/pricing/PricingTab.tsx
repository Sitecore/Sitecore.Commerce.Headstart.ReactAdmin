import {Control, UseFormTrigger, useFieldArray} from "react-hook-form"
import {PriceForm} from "./PriceForm"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {PriceOverrideForm} from "./PriceOverrideForm"
import {appPermissions} from "config/app-permissions.config"
import {ProductDetailFormFields} from "../form-meta"
import {useAuth} from "hooks/useAuth"

interface PricingTabProps {
  control: Control<ProductDetailFormFields>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
  overridePriceSchedules?: IPriceSchedule[]
}
export function PricingTab({control, trigger, priceBreakCount, overridePriceSchedules}: PricingTabProps) {
  const {isAdmin} = useAuth()
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
      {isAdmin && (
        <PriceOverrideForm control={control} fieldArray={fieldArray} overridePriceSchedules={overridePriceSchedules} />
      )}
    </>
  )
}

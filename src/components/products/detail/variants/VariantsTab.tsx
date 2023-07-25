import {SpecTable} from "./SpecTable"
import {VariantTable} from "./VariantTable"
import {ProductDetailFormFields} from "../form-meta"
import {Control} from "react-hook-form"
import {IVariant} from "types/ordercloud/IVariant"
import {ISpec} from "types/ordercloud/ISpec"

interface VariantsTabProps {
  control: Control<ProductDetailFormFields>
  variants: IVariant[]
  specs: ISpec[]
  onGenerateVariants: (shouldOverwrite: boolean) => void
}
export function VariantsTab({control, variants, specs, onGenerateVariants}: VariantsTabProps) {
  return (
    <>
      <SpecTable control={control} />
      <VariantTable
        onGenerateVariants={onGenerateVariants}
        control={control}
        variants={variants}
        specs={specs}
        mt={6}
      />
    </>
  )
}

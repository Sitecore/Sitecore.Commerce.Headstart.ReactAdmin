import {InputControl} from "@/components/react-hook-form"
import {Control, FieldValues} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type UnitOfMeasureFormProps = {
  control: Control<FieldValues, any>
}

export function UnitOfMeasureForm({control}: UnitOfMeasureFormProps) {
  return (
    <>
      <InputControl
        label="Quantity per unit"
        name={fieldNames.QUANTITY_PER_UNIT}
        control={control}
        validationSchema={validationSchema}
      />
      <InputControl
        label="Unit of measure"
        name={fieldNames.UNIT_OF_MEASURE}
        control={control}
        validationSchema={validationSchema}
      />
    </>
  )
}

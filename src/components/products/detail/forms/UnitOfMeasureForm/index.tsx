import {InputControl} from "@/components/formik"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type UnitOfMeasureFormProps = {}

export default function UnitOfMeasureForm({}: UnitOfMeasureFormProps) {
  return (
    <>
      <InputControl label="Quantity per unit" name={fieldNames.QUANTITY_PER_UNIT} validationSchema={validationSchema} />
      <InputControl label="Unit of measure" name={fieldNames.UNIT_OF_MEASURE} validationSchema={validationSchema} />
    </>
  )
}

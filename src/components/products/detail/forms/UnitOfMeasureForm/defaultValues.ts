import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

const defaultValues: Record<FieldName, any> = {
  [fieldNames.QUANTITY_PER_UNIT]: 1,
  [fieldNames.UNIT_OF_MEASURE]: "each"
}

export default defaultValues

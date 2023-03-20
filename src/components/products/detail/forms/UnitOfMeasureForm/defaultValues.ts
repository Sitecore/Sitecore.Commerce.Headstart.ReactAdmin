import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

export const defaultValues: Record<FieldName, any> = {
  [fieldNames.QUANTITY_PER_UNIT]: 1,
  [fieldNames.UNIT_OF_MEASURE]: "each"
}

import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

const defaultValues: Record<FieldName, any> = {
  [fieldNames.TRACK_QUANTITY]: false,
  [fieldNames.TRACK_VARIANTS]: false,
  [fieldNames.INVENTORY_QUANTITY_AVAILABLE]: "",
  [fieldNames.ORDER_CAN_EXCEED_INVENTORY]: false
}

export default defaultValues

import * as yup from "yup"
import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

const formShape: Record<FieldName, any> = {
  [fieldNames.TRACK_QUANTITY]: yup.bool(),
  [fieldNames.TRACK_VARIANTS]: yup.bool(),
  [fieldNames.INVENTORY_QUANTITY_AVAILABLE]: yup.number(),
  [fieldNames.ORDER_CAN_EXCEED_INVENTORY]: yup.bool()
}

export default formShape

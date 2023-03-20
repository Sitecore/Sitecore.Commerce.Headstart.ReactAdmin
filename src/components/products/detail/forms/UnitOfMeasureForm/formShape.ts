import * as yup from "yup"
import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

const formShape: Record<FieldName, any> = {
  [fieldNames.QUANTITY_PER_UNIT]: yup.number().min(1),
  [fieldNames.UNIT_OF_MEASURE]: yup.string().max(50)
}

export default formShape

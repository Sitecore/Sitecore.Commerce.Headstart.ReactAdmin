import {ValuesType} from "types/type-helpers/ValuesType"
import * as yup from "yup"
import * as fieldNames from "./fieldNames"

type FieldName = ValuesType<typeof fieldNames>

const formShape: Record<FieldName, any> = {
  [fieldNames.ACTIVE]: yup.bool(),
  [fieldNames.NAME]: yup.string().max(100).required("Name is required"),
  [fieldNames.SKU]: yup.string().max(100)
}

export default formShape

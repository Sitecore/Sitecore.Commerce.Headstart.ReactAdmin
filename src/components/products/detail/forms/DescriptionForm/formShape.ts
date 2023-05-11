import {ValuesType} from "types/type-helpers/ValuesType"
import * as yup from "yup"
import * as fieldNames from "./fieldNames"

type FieldName = ValuesType<typeof fieldNames>

export const formShape: Record<FieldName, any> = {
  [fieldNames.DESCRIPTION]: yup.string().max(2000)
}

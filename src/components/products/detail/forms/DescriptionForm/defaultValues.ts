import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

const defaultValues: Record<FieldName, any> = {
  [fieldNames.DESCRIPTION]: ""
}

export default defaultValues

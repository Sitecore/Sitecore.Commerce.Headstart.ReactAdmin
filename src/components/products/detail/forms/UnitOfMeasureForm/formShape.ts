import * as yup from "yup"
import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"
import {emptyStringToNull} from "utils"

type FieldName = ValuesType<typeof fieldNames>

export const formShape: Record<FieldName, any> = {
  [fieldNames.QUANTITY_PER_UNIT]: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .min(1, "Must be at least 1")
    .typeError("You must specify a number"),
  [fieldNames.UNIT_OF_MEASURE]: yup.string().max(50)
}

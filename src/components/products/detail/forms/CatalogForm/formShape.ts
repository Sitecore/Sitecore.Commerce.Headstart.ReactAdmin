import {ValuesType} from "types/type-helpers/ValuesType"
import * as yup from "yup"
import * as fieldNames from "./fieldNames"

type FieldName = ValuesType<typeof fieldNames>

export const formShape: Record<FieldName, any> = {
  [fieldNames.CATALOG_ID]: yup.string().max(100).required("Required"),
  [fieldNames.PRODUCT_ID]: yup.string().max(100)
}

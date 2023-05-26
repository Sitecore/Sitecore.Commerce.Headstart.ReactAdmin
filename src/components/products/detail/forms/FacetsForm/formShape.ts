import * as yup from "yup";
import * as fieldNames from "./fieldNames";
import {ValuesType} from "types/type-helpers/ValuesType"

// Define your custom Facets object schema
type FieldName = ValuesType<typeof fieldNames>

export const formShape: Record<FieldName, any> = {
  [fieldNames.FACETS]: yup.object(),
}
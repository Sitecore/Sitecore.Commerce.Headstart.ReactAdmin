import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

export const defaultValues: Record<FieldName, any> = {
  [fieldNames.SHIP_LENGTH]: "",
  [fieldNames.SHIP_WIDTH]: "",
  [fieldNames.SHIP_HEIGHT]: "",
  [fieldNames.SHIP_LINEAR_UNIT]: "in",
  [fieldNames.SHIP_WEIGHT]: "",
  [fieldNames.SHIP_WEIGHT_UNIT]: "lb",
  [fieldNames.SHIP_FROM_COMPANYID]: "",
  [fieldNames.SHIP_FROM]: "",
  [fieldNames.ELIGIBLE_FOR_RETURNS]: true
}

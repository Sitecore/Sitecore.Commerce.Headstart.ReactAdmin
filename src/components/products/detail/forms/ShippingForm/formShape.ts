import * as yup from "yup"
import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

const formShape: Record<FieldName, any> = {
  [fieldNames.SHIP_LENGTH]: yup.number(),
  [fieldNames.SHIP_WIDTH]: yup.number(),
  [fieldNames.SHIP_HEIGHT]: yup.number(),
  [fieldNames.SHIP_LINEAR_UNIT]: yup.string(),
  [fieldNames.SHIP_WEIGHT]: yup.number(),
  [fieldNames.SHIP_WEIGHT_UNIT]: yup.string(),
  [fieldNames.SHIP_FROM_COMPANYID]: yup.string(),
  [fieldNames.SHIP_FROM]: yup.string(),
  [fieldNames.ELIGIBLE_FOR_RETURNS]: yup.bool()
}

export default formShape

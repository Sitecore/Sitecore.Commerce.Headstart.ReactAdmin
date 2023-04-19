import {compact, uniqBy} from "lodash"
import {ValuesType} from "types/type-helpers/ValuesType"
import {emptyStringToNull} from "utils"
import * as yup from "yup"
import * as fieldNames from "./fieldNames"

type FieldName = ValuesType<typeof fieldNames>

const priceBreakSchema = {
  Quantity: yup
    .number()
    .min(1, "Quantity must be at least 1")
    .integer()
    .transform(emptyStringToNull)
    .nullable()
    .typeError("You must specify a number"),
  Price: yup
    .number()
    .min(0, "Price can not be negative")
    .transform(emptyStringToNull)
    .nullable()
    .required("Price is required"),
  SalePrice: yup.number().min(1).transform(emptyStringToNull).nullable().required("Sale price is required")
}

export const formShape: Record<FieldName, any> = {
  [fieldNames.SALE_START]: yup.string(),
  [fieldNames.SALE_END]: yup.string(),
  [fieldNames.RESTRICTED_QUANTITY]: yup.bool(),
  [fieldNames.PRICE_BREAKS]: yup
    .array()
    .of(yup.object().shape(priceBreakSchema))
    .test({
      name: "is-unique-price",
      message: "One or more price breaks have the same price",
      test: (priceBreaks = []) => compact(uniqBy(priceBreaks, "Price")).length === priceBreaks.length
    })
    .test({
      name: "is-unique-quantity",
      message: "One or more price breaks have the same quantity",
      test: (priceBreaks = []) => compact(uniqBy(priceBreaks, "Quantity")).length === priceBreaks.length
    }),
  [fieldNames.MIN_QUANTITY]: yup
    .number()
    .min(1, "Maximum quantity must be at least 1")
    .integer("Maximum quantity must be an integer")
    .transform(emptyStringToNull)
    .nullable()
    .typeError("You must specify a number"),
  [fieldNames.MAX_QUANTITY]: yup
    .number()
    .integer("Minimum quantity must be an integer")
    .transform(emptyStringToNull)
    .nullable()
    .typeError("You must specify a number")
}

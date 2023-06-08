import * as fieldNames from "./fieldNames"
import {ValuesType} from "types/type-helpers/ValuesType"

type FieldName = ValuesType<typeof fieldNames>

export const defaultValues: Record<FieldName, any> = {
  [fieldNames.SALE_START]: "",
  [fieldNames.SALE_END]: "",
  [fieldNames.RESTRICTED_QUANTITY]: false,
  [fieldNames.MIN_QUANTITY]: 1,
  [fieldNames.MAX_QUANTITY]: "",
  [fieldNames.PRICE_BREAKS]: [{Quantity: 1, Price: "", SalePrice: "", SubscriptionPrice: ""}]
}

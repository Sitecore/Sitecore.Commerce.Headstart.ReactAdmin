import {LineItem} from "ordercloud-javascript-sdk"
import {IBuyerAddressXp} from "./IBuyer"
import {IProductXp} from "./IProduct"
import {ISupplierAddressXp} from "./ISupplierAddress"
import {IVariantXp} from "./IVariant"

export type ILineItem = LineItem<ILineItemXp, IProductXp, IVariantXp, IBuyerAddressXp, ISupplierAddressXp>

export interface ILineItemXp {
  // add custom xp properties required for this project here
}

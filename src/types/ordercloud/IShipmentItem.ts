import {ShipmentItem} from "ordercloud-javascript-sdk"
import {IProductXp} from "./IProduct"
import {IVariantXp} from "./IVariant"
import {ILineItemXp} from "./ILineItem"

export type IShipmentItem = ShipmentItem<ILineItemXp, IProductXp, IVariantXp>

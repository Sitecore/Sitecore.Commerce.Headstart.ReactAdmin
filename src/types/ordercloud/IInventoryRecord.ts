import {InventoryRecord} from "ordercloud-javascript-sdk"
import {ISupplierAddressXp} from "./ISupplierAddress"

export type IInventoryRecord = InventoryRecord<IInventoryRecordXp, ISupplierAddressXp>

export interface IInventoryRecordXp {
  // add custom xp properties required for this project here
}

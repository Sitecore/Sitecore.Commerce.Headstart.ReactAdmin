import {Shipment} from "ordercloud-javascript-sdk"
import {IShipmentItem} from "./IShipmentItem"

export type IShipment = Shipment<ShipmentXp> & {
  // additional data set only when retrieving shipment on order detail
  // not part of typical API response
  ShipmentItems: IShipmentItem[]
}
export interface ShipmentXp {
  // add custom xp properties required for this project here
  ShippingMethod?: string
  Comments?: string
}

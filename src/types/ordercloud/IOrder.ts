import {Order} from "ordercloud-javascript-sdk"
import {IBuyerAddressXp} from "./IBuyer"
import {IBuyerUserXp} from "./IBuyerUser"

export type IOrder = Order<IOrderXp, IBuyerUserXp, IBuyerAddressXp>

export interface IOrderXp {
  // add custom xp properties required for this project here
}

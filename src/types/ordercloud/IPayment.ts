import {Payment} from "ordercloud-javascript-sdk"
import {ICreditCard} from "./ICreditCard"
import {ISpendingAccount} from "./ISpendingAccount"

export type IPayment = Payment<IPaymentXp> & {
  CreditCard?: ICreditCard // this is added in useOrderDetail but is not normally returned by the api
  SpendingAccount?: ISpendingAccount // this is added in useOrderDetail but is not normally returned by the api
}

export interface IPaymentXp {
  // add custom xp properties required for this project here
}

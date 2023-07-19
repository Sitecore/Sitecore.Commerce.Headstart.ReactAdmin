import {Payment} from "ordercloud-javascript-sdk"
import {ICreditCard} from "./ICreditCard"
import {ISpendingAccount} from "./ISpendingAccount"

export type IPayment = Payment<IPaymentXp> & {
  SpendingAccount?: ISpendingAccount // this is added in useOrderDetail but is not normally returned by the api
}

export interface IPaymentXp {
  // We must save display only card details on the payment xp
  // because the seller won't be able to view personal credit card details via the API
  CreditCard?: Pick<ICreditCard, "CardType" | "PartialAccountNumber">
}

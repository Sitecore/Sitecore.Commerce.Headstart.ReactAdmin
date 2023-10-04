import {CreditCard} from "ordercloud-javascript-sdk"

export type ICreditCard = CreditCard<ICreditCardXp> & {
  // The API defines CardType as a string, but here we're restricting it to a set of known values
  CardType?: "Visa" | "Mastercard" | "AmericanExpress" | "Discover"
}

export interface ICreditCardXp {
  // add custom xp properties required for this project here
}

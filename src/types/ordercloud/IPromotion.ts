import {Promotion} from "ordercloud-javascript-sdk"

export type IPromotion = Promotion<IPromotionXp>

export interface IPromotionXp {
  // add custom xp properties required for this project here
  Tier: string
  Type: string
  Customer: string
}

export enum PromotionTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD"
}

export enum PromotionType {
  GENERIC = "GENERIC",
  INDIVIDUAL = "INDIVIDUAL"
}

export interface PromotionXPs {
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

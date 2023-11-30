import {Promotion} from "ordercloud-javascript-sdk"

export type IPromotion = Promotion<IPromotionXp>

export interface IPromotionXp {
  // add custom xp properties required for this project here

  eligibleExpressionQuery: any
  valueExpressionQuery: any
}

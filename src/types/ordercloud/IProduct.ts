import {Product} from "ordercloud-javascript-sdk"

export type IProduct = Product<IProductXp>

export interface IProductXp {
  // add custom xp properties required for this project here
  Images?: XpImage[]
  UnitOfMeasure?: string
}

export interface XpImage {
  Url?: string
  ThumbnailUrl?: string
}

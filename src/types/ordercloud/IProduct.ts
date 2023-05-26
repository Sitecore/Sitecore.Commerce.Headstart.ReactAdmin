import {Product} from "ordercloud-javascript-sdk"

export type IProduct = Product<IProductXp>

export interface IProductXp {
  // add custom xp properties required for this project here
  Images?: XpImage[]
  UnitOfMeasure?: string
  Facets?: { [key: string]: any[] }
}

export interface XpImage {
  Url?: string
  ThumbnailUrl?: string
}

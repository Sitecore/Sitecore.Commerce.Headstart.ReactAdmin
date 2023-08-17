import {Product} from "ordercloud-javascript-sdk"

export type IProduct = Product<IProductXp>

export interface IProductXp {
  // add custom xp properties required for this project here
  Images?: XpImage[]
  UnitOfMeasure?: UnitOfMeasure
  Facets?: {[key: string]: any[]}
  ShipLinearUnit?: string
  ShipWeightUnit?: string
  ShipFromCompanyID?: string
  ShipsFromMultipleLocations?: boolean
}

export interface XpImage {
  Url?: string
  ThumbnailUrl?: string
}

export interface UnitOfMeasure {
  Qty?: number
  Unit?: string
}

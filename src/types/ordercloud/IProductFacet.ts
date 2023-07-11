import {ProductFacet} from "ordercloud-javascript-sdk"

export type IProductFacet = ProductFacet<IProductFacetXp>

export interface IProductFacetXp {
  // add custom xp properties required for this project here
  Options: string[]
}

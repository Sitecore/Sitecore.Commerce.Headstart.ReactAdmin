import {CategoryProductAssignment} from "ordercloud-javascript-sdk"

export type ICategoryProductAssignment = CategoryProductAssignment & {
  CatalogID: string // added by us in useProductDetail to differentiate between category assignments of different catalogs
}

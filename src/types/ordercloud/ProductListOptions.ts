import { Filters, SearchType } from "ordercloud-javascript-sdk"

export interface ProductListOptions {
  catalogID?: string
  categoryID?: string
  search?: string
  page?: number
  pageSize?: number
  depth?: string
  searchOn?: string[]
  sortBy?: string[]
  filters?: Filters
  searchType?: SearchType
}

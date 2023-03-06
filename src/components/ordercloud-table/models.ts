import {ListPage} from "ordercloud-javascript-sdk"
import {ReactElement} from "react"

export interface OrderCloudTableFilters {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: any[] // this is a different type based on endpoint called so just use any[]
}

export interface OrderCloudTableColumn<T> {
  Header: string
  accessor?: string
  Cell?: ({row, value}: {row: {original: T}; value: any}) => ReactElement | string
  canSort?: boolean
}

export interface OrderCloudTableHeaders<T> extends OrderCloudTableColumn<T> {
  isSorted?: boolean
  isSortedDesc?: boolean
}

export interface OrderCloudTableCell<T> {
  value: ReactElement
}

export interface OrderCloudTableRow<T> {
  cells: OrderCloudTableCell<T>[]
}

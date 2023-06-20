import {PriceSchedule} from "ordercloud-javascript-sdk"

// field values captured in product detail form for building up the price schedule overrides
export interface OverridePriceScheduleFieldValues {
  id: string // assigned by react-hook-form
  ID?: string
  SaleStart?: string
  SaleEnd?: string
  RestrictedQuantity?: boolean
  MinQuantity?: number
  MaxQuantity?: number
  PriceBreaks?: PriceSchedule["PriceBreaks"]
  ProductAssignments: {
    BuyerID?: string
    BuyerName?: string // not actually captured as a form value, but used for display
    UserGroupID?: string
    UserGroupName?: string // not actually captured as a form value, but used for display
  }[]
}

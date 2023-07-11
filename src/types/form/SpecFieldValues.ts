// field values captured in product detail form for building up specs and spec options
export interface SpecFieldValues {
  id?: string // assigned by react-hook-form
  ID?: string
  Name: string
  DefinesVariant?: boolean
  Options?: SpecOptionFieldValues[]
}

export interface SpecOptionFieldValues {
  id?: string // assigned by react-hook-form
  ID?: string
  Value: string
  ListOrder?: number
  MarkupType?: string
  PriceMarkup?: number
}

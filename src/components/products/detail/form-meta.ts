import {ProductDetailTab} from "./ProductDetail"
import {IProduct} from "types/ordercloud/IProduct"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {v4 as randomId} from "uuid"
import {ISpec} from "types/ordercloud/ISpec"
import {IVariant} from "types/ordercloud/IVariant"
import {ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {array, bool, boolean, number, object, string} from "yup"
import {emptyStringToNull, nullToFalse, orderCloudIDRegex} from "utils"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import {compact, uniqBy} from "lodash"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"

export interface ProductDetailFormFields {
  Product: IProduct
  DefaultPriceSchedule: IPriceSchedule
  OverridePriceSchedules: OverridePriceScheduleFieldValues[]
  Specs: ISpec[]
  Variants: IVariant[]
  CatalogAssignments: ProductCatalogAssignment[]
  CategoryAssignments: ICategoryProductAssignment[]
  InventoryRecords: IInventoryRecord[]
}

// undefined causes issues because the input is not considered controlled
export const defaultValues: ProductDetailFormFields = {
  Product: {
    Active: true,
    Name: "",
    ID: "",
    Description: "",
    Inventory: {
      Enabled: false,
      VariantLevelTracking: false,
      QuantityAvailable: null,
      OrderCanExceed: false
    },
    AutoForward: true, // default value, not captured in form
    ShipLength: null,
    ShipWidth: null,
    ShipHeight: null,
    ShipWeight: null,
    ShipFromAddressID: "",
    Returnable: true,
    QuantityMultiplier: 1,
    xp: {
      Facets: {},
      Images: [],
      ShipLinearUnit: "in",
      ShipWeightUnit: "lb",
      ShipFromCompanyID: "",
      UnitOfMeasure: "each",
      ShipsFromMultipleLocations: false
    }
  },
  DefaultPriceSchedule: {
    Name: randomId(), // this isn't user facing and is only used to satisfy the API,
    SaleStart: null,
    SaleEnd: null,
    RestrictedQuantity: false,
    PriceBreaks: [{Quantity: 1, Price: null, SalePrice: null, SubscriptionPrice: null}],
    MinQuantity: null,
    MaxQuantity: null
  },
  OverridePriceSchedules: [],
  Specs: [],
  Variants: [],
  CatalogAssignments: [],
  CategoryAssignments: [],
  InventoryRecords: []
}

// Not all fields are validated on the main form (for example when input is captured in a modal)
// instead, those fields are validated against their own individual form and then the values are merged into
// the main form values and assumed valid since they've already been validated separately

export const priceScheduleSchema = object().shape({
  SaleStart: string().nullable(),
  SaleEnd: string().nullable(),
  RestrictedQuantity: boolean(),
  MinQuantity: number()
    .min(1, "Minimum quantity must be at least 1")
    .integer("Minimum quantity must be an integer")
    .transform(emptyStringToNull)
    .nullable()
    .typeError("You must specify a number"),
  MaxQuantity: number()
    .integer("Maximum quantity must be an integer")
    .transform(emptyStringToNull)
    .nullable()
    .typeError("You must specify a number"),
  PriceBreaks: array()
    .of(
      object().shape({
        Quantity: number()
          .min(1, "Quantity must be at least 1")
          .integer()
          .transform(emptyStringToNull)
          .nullable()
          .typeError("You must specify a number"),
        Price: number()
          .min(0, "Price can not be negative")
          .transform(emptyStringToNull)
          .nullable()
          .required("Price is required"),
        SalePrice: number().min(0).transform(emptyStringToNull).nullable(),
        SubscriptionPrice: number().min(0).transform(emptyStringToNull).nullable()
      })
    )
    .test({
      name: "is-unique-price",
      message: "One or more price breaks have the same price",
      test: (priceBreaks = []) => compact(uniqBy(priceBreaks, "Price")).length === priceBreaks.length
    })
    .test({
      name: "is-unique-quantity",
      message: "One or more price breaks have the same quantity",
      test: (priceBreaks = []) => compact(uniqBy(priceBreaks, "Quantity")).length === priceBreaks.length
    })
})
export const validationSchema = object().shape({
  Product: object().shape({
    Active: boolean(),
    Name: string().max(100).required("Required"),
    ID: string()
      .matches(orderCloudIDRegex, "ID must be alphanumeric (may also include dashes or underscores)")
      .max(100, "ID may not exceed 100 characters"),
    Description: string().max(2000),
    Inventory: object()
      .nullable()
      .shape({
        Enabled: boolean().transform(nullToFalse), // if Inventory is null, default to false,
        VariantLevelTracking: boolean(),
        QuantityAvailable: number().integer().transform(emptyStringToNull).nullable(),
        OrderCanExceed: boolean()
      }),
    ShipLength: number().transform(emptyStringToNull).nullable().min(0, "Value can not be negative"),
    ShipWidth: number().transform(emptyStringToNull).nullable().min(0, "Value can not be negative"),
    ShipHeight: number().transform(emptyStringToNull).nullable().min(0, "Value can not be negative"),
    ShipWeight: number().transform(emptyStringToNull).nullable().min(0, "Value can not be negative"),
    ShipFromAddressID: string().nullable(),
    Returnable: boolean(),
    QuantityMultiplier: number()
      .transform(emptyStringToNull)
      .nullable()
      .min(1, "Must be at least 1")
      .typeError("You must specify a number"),
    xp: object().shape({
      ShipLinearUnit: string(),
      ShipWeightUnit: string(),
      ShipFromCompanyID: string(),
      UnitOfMeasure: string().max(50),
      ShipsFromMultipleLocations: boolean()
    })
  }),
  DefaultPriceSchedule: priceScheduleSchema,
  Variants: array().of(
    object().shape({
      ID: string()
        .matches(orderCloudIDRegex, "ID must be alphanumeric (may also include dashes or underscores)")
        .required("Required"),
      Active: bool()
    })
  )
})

// list of field names grouped by tab
// this lets us display an error indicator at the tab level if any of the fields in that tab are invalid
// similar to validationSchema not all fields are validated on the main form
export const tabFieldNames: Record<ProductDetailTab, any[]> = {
  Details: ["Product.Description", "Product.Active", "Product.Name", "Product.ID"],
  Pricing: [
    "DefaultPriceSchedule.SaleStart",
    "DefaultPriceSchedule.SaleEnd",
    "DefaultPriceSchedule.RestrictedQuantity",
    "DefaultPriceSchedule.PriceBreaks",
    "DefaultPriceSchedule.MinQuantity",
    "DefaultPriceSchedule.MaxQuantity"
  ],
  Fulfillment: [
    "Product.Inventory.Enabled",
    "Product.Inventory.QuantityAvailable",
    "Product.Inventory.OrderCanExceed",
    "Product.ShipLength",
    "Product.ShipWidth",
    "Product.ShipHeight",
    "Product.xp.ShipLinearUnit",
    "Product.ShipWeight",
    "Product.xp.ShipWeightUnit",
    "Product.Returnable",
    "Product.xp.UnitOfMeasure"
  ],
  Variants: [],
  Media: [],
  Facets: [],
  Customization: [],
  Catalogs: []
}

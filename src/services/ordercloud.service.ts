import {
  Configuration,
  Filters,
  IntegrationEvents,
  LineItems,
  Me,
  OrderWorksheet,
  Orders,
  Payment,
  Payments,
  Product,
  Products,
  RequiredDeep,
  SearchType,
  Spec,
  Variant
} from "ordercloud-javascript-sdk"
import {ProductXPs} from "types/ProductXPs"
import ocConfig from "constants/ordercloud-config"

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

export function SetConfiguration() {
  Configuration.Set({
    clientID: ocConfig.clientId,
    baseApiUrl: ocConfig.baseApiUrl,
    cookieOptions: ocConfig.cookieOptions
  })
}

export interface ComposedProduct {
  Product: RequiredDeep<Product<ProductXPs>>
  Specs: RequiredDeep<Spec<any, any>>[]
  Variants: RequiredDeep<Variant<any>>[]
}

export async function GetComposedProduct(productId: string): Promise<ComposedProduct> {
  if (productId) {
    var product = await Products.Get(productId).catch()
    var specs = await Products.ListSpecs(productId).catch()
    var variants = await Products.ListVariants(productId).catch()
    var composedProduct: ComposedProduct = {
      Product: product,
      Specs: specs?.Items,
      Variants: variants?.Items
    }

    return composedProduct
  }

  return null
}

export interface ComposedOrder {
  Order: OrderWorksheet
  Payment: Payment<any, any>[]
}

export async function GetCurrentOrder() {
  let composedOrder: ComposedOrder
  const response = await Me.ListOrders({
    sortBy: ["DateCreated"],
    filters: {Status: "Unsubmitted"}
  })
  const firstOrder = response.Items[0]
  if (firstOrder) {
    const worksheet = await IntegrationEvents.GetWorksheet("Outgoing", firstOrder.ID)
    if (
      worksheet.Order.BillingAddress &&
      worksheet.ShipEstimateResponse &&
      worksheet.ShipEstimateResponse.ShipEstimates &&
      worksheet.ShipEstimateResponse.ShipEstimates.length &&
      worksheet.ShipEstimateResponse.ShipEstimates.filter((se) => !se.SelectedShipMethodID).length === 0
    ) {
      const response = await Payments.List("Outgoing", worksheet.Order.ID, {
        pageSize: 100
      })
      composedOrder.Payment = response.Items
    }

    composedOrder.Order = worksheet
    return composedOrder
  }
}

export async function RemoveLineItem(lineItemId) {
  var currentOrder = await GetCurrentOrder()
  var orderId = currentOrder?.Order?.Order?.ID
  await LineItems.Delete("Outgoing", orderId, lineItemId)
  return IntegrationEvents.GetWorksheet("Outgoing", orderId)
}

export async function UpdateLineItem(lineItem) {
  var currentOrder = await GetCurrentOrder()
  var orderId = currentOrder?.Order?.Order?.ID
  await LineItems.Save("Outgoing", orderId, lineItem?.ID, lineItem)
  return IntegrationEvents.GetWorksheet("Outgoing", orderId)
}

export async function CreateLineItem(lineItemId) {
  var currentOrder = await GetCurrentOrder()
  var orderId = currentOrder?.Order?.Order?.ID

  // initialize the order if it doesn't exist already
  if (!orderId) {
    const orderResponse = await Orders.Create("Outgoing", {})
    orderId = orderResponse.ID
  }

  // create the new line item
  await LineItems.Create("Outgoing", orderId, lineItemId)
  return IntegrationEvents.GetWorksheet("Outgoing", orderId)
}

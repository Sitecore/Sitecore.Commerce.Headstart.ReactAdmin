import {ORIGINAL_ID} from "constants/original-id"
import {compact, flatten, uniq} from "lodash"
import {
  Catalogs,
  Categories,
  InventoryRecords,
  PriceSchedules,
  ProductCatalogAssignment,
  Products,
  SpecProductAssignment,
  Specs
} from "ordercloud-javascript-sdk"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"
import {IProduct} from "types/ordercloud/IProduct"
import {ISpec} from "types/ordercloud/ISpec"

// This service is used both in useProductDetail
// as well as on submit of the product detail form
// to hydrate data for the product detail page

// we can't simply reload the page because product data is not
// immediately committed to the database and may be stale on subsequent GETs
// therefore we use the response from the PUT/POST for the product data
// and then merry it up with the data for related entities (price schedules, specs etc)
// that *are* safe to re-retrieve because they are committed immediately to the databse
// more info: https://ordercloud.io/knowledge-base/order-search#look-out-for-this-potential-gotcha

export async function fetchProduct(productId: string) {
  return await Products.Get<IProduct>(productId)
}

export async function fetchInventoryRecords(product: IProduct) {
  const response = await InventoryRecords.List<IInventoryRecord>(product.ID, {pageSize: 100})
  return response.Items
}

export async function fetchDefaultPriceSchedule(product: IProduct) {
  if (product?.DefaultPriceScheduleID) {
    return await PriceSchedules?.Get(product?.DefaultPriceScheduleID)
  }
}

export async function fetchSpecs(product: IProduct) {
  const listOptions = {
    filters: {ProductID: product?.ID},
    pageSize: 100
  }
  const specAssignments = await Specs?.ListProductAssignments(listOptions)
  return fetchSpecsFromAssignments(specAssignments.Items)
}

export async function fetchVariants(product: IProduct) {
  const response = await Products?.ListVariants(product?.ID)
  return response.Items.map((variant) => {
    // we need to keep a reference to the original ID in order to make updates (since we let users modify ID)
    variant[ORIGINAL_ID] = variant.ID
    return variant
  })
}

export async function fetchOverridePriceSchedules(product: IProduct) {
  const assignments = await Products.ListAssignments({productID: product.ID, pageSize: 100})
  if (!assignments.Items.length) {
    return []
  }
  const priceScheduleIDs = compact(uniq(assignments.Items.map((assignment) => assignment.PriceScheduleID)))
  if (!priceScheduleIDs.length) {
    return []
  }
  const priceSchedules = await PriceSchedules.List({filters: {ID: priceScheduleIDs.join("|")}})
  return priceSchedules.Items.map((priceSchedule) => {
    priceSchedule["ProductAssignments"] = assignments.Items.filter(
      (assignment) => assignment.PriceScheduleID === priceSchedule.ID
    )
    return priceSchedule
  })
}

async function fetchSpecsFromAssignments(items: SpecProductAssignment[]) {
  if (!items.length) {
    return []
  }
  const specIDs = uniq(items.map((assignment) => assignment.SpecID))
  if (!specIDs.length) {
    return []
  }
  const listResponse = await Specs.List<ISpec>({filters: {ID: specIDs.join("|")}})
  return listResponse.Items
}

export async function fetchProductCatalogAssignments(product: IProduct) {
  const catalogAssignments = await Catalogs.ListProductAssignments({productID: product.ID, pageSize: 100})
  return catalogAssignments.Items
}

export async function fetchProductCategoryAssignments(catalogAssignments: ProductCatalogAssignment[]) {
  const requests = catalogAssignments.map(async (catalogAssignment) => {
    const categoryAssignments = await Categories.ListProductAssignments<ICategoryProductAssignment>(
      catalogAssignment.CatalogID,
      {
        productID: catalogAssignment.ProductID
      }
    )
    return categoryAssignments.Items.map((assignment) => {
      // need in order to differentitate between category assignments of different catalogs
      assignment.CatalogID = catalogAssignment.CatalogID
      return assignment
    })
  })
  const responses = await Promise.all(requests)
  return flatten(responses)
}

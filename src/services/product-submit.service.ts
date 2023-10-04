import {difference, differenceBy, isEmpty, omit} from "lodash"
import {
  PriceSchedules,
  Products,
  ProductAssignment,
  Specs,
  ProductCatalogAssignment,
  Catalogs,
  Categories,
  InventoryRecords
} from "ordercloud-javascript-sdk"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import {SpecFieldValues, SpecOptionFieldValues} from "types/form/SpecFieldValues"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {ISpec} from "types/ordercloud/ISpec"
import {getItemsToAdd, getItemsToDelete, getItemsToUpdate, getObjectDiff} from "utils"
import {v4 as randomId} from "uuid"
import {
  fetchInventoryRecords,
  fetchOverridePriceSchedules,
  fetchProductCatalogAssignments,
  fetchProductCategoryAssignments,
  fetchSpecs
} from "./product-data-fetcher.service"
import {IVariant} from "types/ordercloud/IVariant"
import {VariantFieldValues} from "types/form/VariantFieldValues"
import {ORIGINAL_ID} from "constants/original-id"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"

export async function submitProduct(
  isCreatingNew: boolean,
  oldDefaultPriceSchedule: IPriceSchedule,
  newDefaultPriceSchedule: IPriceSchedule,
  oldProduct: IProduct,
  newProduct: IProduct,
  oldInventoryRecords: IInventoryRecord[],
  newInventoryRecords: IInventoryRecord[],
  oldSpecs: ISpec[],
  newSpecs: SpecFieldValues[],
  oldVariants: IVariant[],
  newVariants: VariantFieldValues[],
  oldOverridePriceSchedules: IPriceSchedule[],
  newOverridePriceSchedules: OverridePriceScheduleFieldValues[],
  oldCatalogAssignments: ProductCatalogAssignment[],
  newCatalogAssignments: ProductCatalogAssignment[],
  oldCategoryAssignments: ICategoryProductAssignment[],
  newCategoryAssignments: ICategoryProductAssignment[]
) {
  // create/update price schedule
  const updatedDefaultPriceSchedule = await handleUpdateDefaultPriceSchedule(
    oldDefaultPriceSchedule,
    newDefaultPriceSchedule,
    isCreatingNew
  )

  // create/update product
  let updatedProduct = await handleUpdateProduct(oldProduct, newProduct, updatedDefaultPriceSchedule, isCreatingNew)

  // create/update/delete inventory records
  const updatedInventoryRecords = await handleUpdateInventoryRecords(
    oldInventoryRecords,
    newInventoryRecords,
    updatedProduct
  )

  if (updatedInventoryRecords.length && !updatedProduct.Inventory?.Enabled) {
    updatedProduct = await Products.Patch(updatedProduct.ID, {Inventory: {Enabled: true}})
  }

  // create/update/delete specs & spec options
  const {updatedSpecs, didUpdateSpecs} = await handleUpdateSpecs(oldSpecs, newSpecs, updatedProduct)

  // update variants
  const updatedVariants = await handleUpdateVariants(oldVariants, newVariants, updatedProduct, updatedSpecs)

  // create/update/delete category assignments
  // Note: this must happen BEFORE price overrides to ensure product is visible to assigned buyers
  const updatedCategoryAssignments = await handleUpdateCategoryAssignments(
    oldCategoryAssignments,
    newCategoryAssignments,
    updatedProduct
  )

  // create/update/delete catalog assignments
  // Note: this must happen BEFORE price overrides to ensure product is visible to assigned buyers
  const updatedCatalogAssignments = await handleUpdateCatalogAssignments(
    oldCatalogAssignments,
    newCatalogAssignments,
    updatedProduct
  )

  // create/update/delete price overrides and related assignments
  const updatedPriceOverrides = await handleUpdatePriceOverrides(
    oldOverridePriceSchedules,
    newOverridePriceSchedules.filter((priceSchedule) => priceSchedule.PriceBreaks[0].Price),
    updatedProduct
  )

  return {
    updatedProduct,
    updatedInventoryRecords,
    updatedSpecs,
    didUpdateSpecs,
    updatedVariants,
    updatedPriceOverrides,
    updatedDefaultPriceSchedule,
    updatedCatalogAssignments,
    updatedCategoryAssignments
  }
}

async function handleUpdateCatalogAssignments(
  oldCatalogAssignments: ProductCatalogAssignment[],
  newCatalogAssignments: ProductCatalogAssignment[],
  product: IProduct
) {
  const addCatalogAssignments = differenceBy(newCatalogAssignments, oldCatalogAssignments, (ass) => ass.CatalogID)
  const deleteCatalogAssignments = differenceBy(oldCatalogAssignments, newCatalogAssignments, (ass) => ass.CatalogID)

  const addCatalogAssignmentRequests = addCatalogAssignments.map(async (assignment) =>
    Catalogs.SaveProductAssignment({...assignment, ProductID: product.ID})
  )
  const deleteCatalogAssignmentRequests = deleteCatalogAssignments.map(async (assignment) =>
    Catalogs.DeleteProductAssignment(assignment.CatalogID, product.ID)
  )

  await Promise.all([...addCatalogAssignmentRequests, ...deleteCatalogAssignmentRequests])
  return await fetchProductCatalogAssignments(product)
}

async function handleUpdateCategoryAssignments(
  oldCategoryAssignments: ICategoryProductAssignment[],
  newCategoryAssignments: ICategoryProductAssignment[],
  product: IProduct
) {
  const addCategoryAssignments = differenceBy(
    newCategoryAssignments,
    oldCategoryAssignments,
    (ass) => ass.CatalogID + ass.CategoryID
  )
  const deleteCategoryAssignments = differenceBy(
    oldCategoryAssignments,
    newCategoryAssignments,
    (ass) => ass.CatalogID + ass.CategoryID
  )

  const addCategoryAssignmentRequests = addCategoryAssignments.map(async (assignment) => {
    await Categories.SaveProductAssignment(assignment.CatalogID, {...assignment, ProductID: product.ID})
  })

  const deleteCategoryAssignmentRequests = deleteCategoryAssignments.map(async (assignment) => {
    await Categories.DeleteProductAssignment(assignment.CatalogID, assignment.CategoryID, product.ID)
  })

  await Promise.all([...addCategoryAssignmentRequests, ...deleteCategoryAssignmentRequests])
  // If a category is assigned to a product, and previously that category had not been
  // assigned to a catalog, then OrderCloud will implicitly create a catalog assignment
  // thus we need to retrieve new catalog assignments here first
  const catalogAssignments = await fetchProductCatalogAssignments(product)
  return await fetchProductCategoryAssignments(catalogAssignments)
}

async function handleUpdateDefaultPriceSchedule(
  oldPriceSchedule: IPriceSchedule,
  newPriceSchedule: IPriceSchedule,
  isCreatingNew: boolean
) {
  let updatedDefaultPriceSchedule: IPriceSchedule
  if (isCreatingNew) {
    updatedDefaultPriceSchedule = await PriceSchedules.Create<IPriceSchedule>({
      ...newPriceSchedule,
      Name: randomId() // this isn't user facing and is only used to satisfy the API
    })
  } else {
    const diff = getObjectDiff(oldPriceSchedule, newPriceSchedule)
    updatedDefaultPriceSchedule = await PriceSchedules.Patch<IPriceSchedule>(oldPriceSchedule.ID, diff)
  }
  return updatedDefaultPriceSchedule
}

async function handleUpdateProduct(
  oldProduct: IProduct,
  newProduct: IProduct,
  updatedPriceSchedule: IPriceSchedule,
  isCreatingNew: boolean
) {
  let updatedProduct: IProduct
  if (isCreatingNew) {
    newProduct.DefaultPriceScheduleID = updatedPriceSchedule.ID
    updatedProduct = await Products.Create<IProduct>(newProduct)
  } else {
    const diff = getObjectDiff(oldProduct, newProduct) as IProduct
    const reverseXpDiff = getObjectDiff(newProduct.xp, oldProduct.xp)
    const didDeleteCustomXp = difference(Object.keys(reverseXpDiff || {}), Object.keys(diff.xp || {})).length > 0
    if (isEmpty(diff) && !didDeleteCustomXp) {
      updatedProduct = oldProduct
    } else {
      if (didDeleteCustomXp) {
        // Its not possible to delete extended properties with a single PATCH
        // so we must perform a PUT with the full product object instead
        updatedProduct = await Products.Save<IProduct>(oldProduct.ID, newProduct)
      } else {
        updatedProduct = await Products.Patch<IProduct>(oldProduct.ID, diff)
      }
    }
  }
  return updatedProduct
}

async function handleUpdatePriceOverrides(
  oldPriceSchedules: IPriceSchedule[],
  newPriceSchedules: OverridePriceScheduleFieldValues[],
  product: IProduct
) {
  const addPriceSchedules = getItemsToAdd(newPriceSchedules)
  const updatePriceSchedules = getItemsToUpdate(oldPriceSchedules, newPriceSchedules)
  const deletePriceSchedules = getItemsToDelete(oldPriceSchedules, newPriceSchedules)

  const addPriceScheduleRequests = addPriceSchedules.map(async (priceOverride: OverridePriceScheduleFieldValues) => {
    const priceSchedule = await PriceSchedules.Create<IPriceSchedule>({
      ...priceOverride,
      Name: randomId() // this isn't user facing and is only used to satisfy the API
    })
    const addRequests = priceOverride.ProductAssignments.map((assignment) => {
      return Products.SaveAssignment({
        ...assignment,
        PriceScheduleID: priceSchedule.ID,
        ProductID: product.ID
      })
    })
    await Promise.all(addRequests)
  })

  const updatePriceScheduleRequests = updatePriceSchedules.map(async (priceOverride) => {
    const oldPriceSchedule = oldPriceSchedules.find((oldPriceSchedule) => oldPriceSchedule.ID === priceOverride.ID)
    const diff = getObjectDiff(oldPriceSchedule, priceOverride)
    const priceSchedule = isEmpty(diff)
      ? oldPriceSchedule
      : await PriceSchedules.Patch<IPriceSchedule>(priceOverride.ID, diff)
    await updateProductAssignments(priceSchedule.ID, priceOverride.ProductAssignments, product)
  })

  const deletePriceScheduleRequests = deletePriceSchedules.map(async (priceOverride) =>
    PriceSchedules.Delete(priceOverride.ID)
  )

  await Promise.all([...addPriceScheduleRequests, ...updatePriceScheduleRequests, ...deletePriceScheduleRequests])
  return await fetchOverridePriceSchedules(product)
}

async function updateProductAssignments(
  priceScheduleId: string,
  newAssignments: ProductAssignment[],
  product: IProduct
) {
  const oldAssignmentsList = await Products.ListAssignments({productID: product.ID, priceScheduleID: priceScheduleId})
  const oldAssignments = oldAssignmentsList.Items

  // determine which assignments to add
  const addAssignments = newAssignments.filter((newAssignment) => {
    const oldAssignment = oldAssignments.find((oldAssignment) => {
      if (newAssignment.UserGroupID) {
        return (
          oldAssignment.BuyerID === newAssignment.BuyerID && oldAssignment.UserGroupID === newAssignment.UserGroupID
        )
      } else {
        return oldAssignment.BuyerID === newAssignment.BuyerID
      }
    })
    return !oldAssignment
  })

  // determine which assignments to remove
  const removeAssignments = oldAssignments.filter((oldAssignment) => {
    const newAssignment = newAssignments.find((newAssignment) => {
      if (newAssignment.UserGroupID) {
        return (
          oldAssignment.BuyerID === newAssignment.BuyerID && oldAssignment.UserGroupID === newAssignment.UserGroupID
        )
      } else {
        return oldAssignment.BuyerID === newAssignment.BuyerID
      }
    })
    return !newAssignment
  })

  const addRequests = addAssignments.map((assignment) => {
    return Products.SaveAssignment({
      ...assignment,
      PriceScheduleID: priceScheduleId,
      ProductID: product.ID
    })
  })

  const removeRequests = removeAssignments.map((assignment) => {
    return Products.DeleteAssignment(product.ID, assignment.BuyerID, {userGroupID: assignment.UserGroupID})
  })

  await Promise.all([...addRequests, ...removeRequests])
}

async function handleUpdateInventoryRecords(
  oldRecords: IInventoryRecord[],
  newRecords: IInventoryRecord[],
  product: IProduct
) {
  if (!product.xp.ShipsFromMultipleLocations) {
    const allDeleteRequests = oldRecords.map(async (record) => InventoryRecords.Delete(product.ID, record.ID))
    await Promise.all(allDeleteRequests)
    return []
  }

  const addRecords = getItemsToAdd(newRecords)
  const updateRecords = getItemsToUpdate(oldRecords, newRecords)
  const deleteRecords = getItemsToDelete(oldRecords, newRecords)

  const addRecordRequests = addRecords.map(async (record) => {
    const newRecord = await InventoryRecords.Create(product.ID, record)
    return newRecord
  })

  const updateRecordRequests = updateRecords.map(async (record) => {
    const oldRecord = oldRecords.find((oldRecord) => oldRecord.ID === record.ID)
    const diff = getObjectDiff(oldRecord, record)
    await InventoryRecords.Patch(product.ID, record.ID, diff)
  })

  const deleteRecordRequests = deleteRecords.map(async (record) => InventoryRecords.Delete(product.ID, record.ID))

  await Promise.all([...addRecordRequests, ...updateRecordRequests, ...deleteRecordRequests])

  const updatedInventoryRecords = fetchInventoryRecords(product)
  return updatedInventoryRecords
}

async function handleUpdateSpecs(oldSpecs: ISpec[], newSpecs: SpecFieldValues[], product: IProduct) {
  const addSpecs = getItemsToAdd(newSpecs)
  const updateSpecs = getItemsToUpdate(oldSpecs, newSpecs)
  const deleteSpecs = getItemsToDelete(oldSpecs, newSpecs)

  const addSpecRequests = addSpecs.map(async (spec) => {
    const newSpec = await Specs.Create<ISpec>(spec)
    const optionRequests = spec.Options.map((option) => Specs.CreateOption(newSpec.ID, option))
    await Promise.all(optionRequests)
    await Specs.SaveProductAssignment({SpecID: newSpec.ID, ProductID: product.ID})
  })

  const updateSpecRequests = updateSpecs.map(async (spec) => {
    const oldSpec = oldSpecs.find((oldSpec) => oldSpec.ID === spec.ID)
    const diff = getObjectDiff(oldSpec, spec)
    const diffWithoutAssignments = omit(diff, ["ProductAssignments", "id"])
    if (!isEmpty(diffWithoutAssignments)) {
      await Specs.Patch<ISpec>(spec.ID, diffWithoutAssignments)
    }
    await handleUpdateSpecOptions(spec.ID, spec.Options)
  })

  const deleteSpecRequests = deleteSpecs.map(async (spec) => Specs.Delete(spec.ID))

  await Promise.all([...addSpecRequests, ...updateSpecRequests, ...deleteSpecRequests])
  const updatedSpecs = await fetchSpecs(product)
  return {updatedSpecs, didUpdateSpecs: addSpecs.length || updateSpecs.length || deleteSpecs.length}
}

async function handleUpdateVariants(
  oldVariants: IVariant[],
  newVariants: VariantFieldValues[],
  product: IProduct,
  updatedSpecs: ISpec[]
) {
  if (!updatedSpecs.length && newVariants?.length) {
    // unique case where we should clear out any remaining variants since there are no specs
    await Products.GenerateVariants(product.ID, {overwriteExisting: true})
    return []
  }

  // we keep a reference to the original ID in order to make updates (since we let users modify ID)
  const updateVariants = getItemsToUpdate(oldVariants, newVariants, ORIGINAL_ID)
  const updateVariantsRequests = updateVariants.map(async (variant) => {
    const oldVariant = oldVariants.find((oldVariant) => oldVariant[ORIGINAL_ID] === variant[ORIGINAL_ID])
    const diff = getObjectDiff(oldVariant, variant)
    const patch = await Products.PatchVariant(product.ID, oldVariant[ORIGINAL_ID], diff)
    patch[ORIGINAL_ID] = patch.ID
    return {
      UpdatedId: oldVariant[ORIGINAL_ID],
      Update: patch
    }
  })
  const updateVariantsResponses = await Promise.all(updateVariantsRequests)

  // We can't fetch variants from the API because similar to products they might be stale
  // use the return value to update our list in place
  return oldVariants.map((oldVariant) => {
    const update = updateVariantsResponses.find((u) => u.UpdatedId === oldVariant[ORIGINAL_ID])?.Update
    return update || oldVariant
  })
}

async function handleUpdateSpecOptions(specId, newOptions: SpecOptionFieldValues[]) {
  const oldOptions = await Specs.ListOptions(specId)

  const addOptions = getItemsToAdd(newOptions)
  const updateOptions = getItemsToUpdate(oldOptions.Items, newOptions)
  const deleteOptions = getItemsToDelete(oldOptions.Items, newOptions)

  const addOptionRequests = addOptions.map(async (option) => Specs.CreateOption(specId, option))
  const updateOptionRequests = updateOptions.map(async (option) => Specs.PatchOption(specId, option.ID, option))
  const deleteOptionRequests = deleteOptions.map(async (option) => Specs.DeleteOption(specId, option.ID))

  await Promise.all([...addOptionRequests, ...updateOptionRequests, ...deleteOptionRequests])
}

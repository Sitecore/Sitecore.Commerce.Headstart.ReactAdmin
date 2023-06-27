import {isEmpty, omit} from "lodash"
import {PriceSchedules, Products, ProductAssignment, Specs} from "ordercloud-javascript-sdk"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import {SpecFieldValues, SpecOptionFieldValues} from "types/form/SpecFieldValues"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {ISpec} from "types/ordercloud/ISpec"
import {getObjectDiff} from "utils"
import {v4 as randomId} from "uuid"
import {fetchOverridePriceSchedules, fetchSpecs} from "./product-data-fetcher.service"
import {IVariant} from "types/ordercloud/IVariant"
import {VariantFieldValues} from "types/form/VariantFieldValues"
import {ORIGINAL_ID} from "constants/original-id"

export async function submitProduct(
  isCreatingNew: boolean,
  oldDefaultPriceSchedule: IPriceSchedule,
  newDefaultPriceSchedule: IPriceSchedule,
  oldProduct: IProduct,
  newProduct: IProduct,
  oldSpecs: ISpec[],
  newSpecs: SpecFieldValues[],
  oldVariants: IVariant[],
  newVariants: VariantFieldValues[],
  oldOverridePriceSchedules: IPriceSchedule[],
  newOverridePriceSchedules: OverridePriceScheduleFieldValues[]
) {
  // create/update price schedule
  const updatedDefaultPriceSchedule = await handleUpdateDefaultPriceSchedule(
    oldDefaultPriceSchedule,
    newDefaultPriceSchedule,
    isCreatingNew
  )

  // create/update product
  const updatedProduct = await handleUpdateProduct(oldProduct, newProduct, updatedDefaultPriceSchedule, isCreatingNew)

  // create/update/delete specs & spec options
  const {updatedSpecs, didUpdateSpecs} = await handleUpdateSpecs(oldSpecs, newSpecs, updatedProduct)

  // update variants
  const updatedVariants = await handleUpdateVariants(oldVariants, newVariants, updatedProduct, updatedSpecs)

  // create/update/delete price overrides and related assignments
  const updatedPriceOverrides = await handleUpdatePriceOverrides(
    oldOverridePriceSchedules,
    newOverridePriceSchedules.filter((priceSchedule) => priceSchedule.PriceBreaks[0].Price),
    updatedProduct
  )

  return {
    updatedProduct,
    updatedSpecs,
    didUpdateSpecs,
    updatedVariants,
    updatedPriceOverrides,
    updatedDefaultPriceSchedule
  }
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
): Promise<IProduct> {
  let updatedProduct: IProduct
  if (isCreatingNew) {
    newProduct.DefaultPriceScheduleID = updatedPriceSchedule.ID
    updatedProduct = await Products.Create<IProduct>(newProduct)
  } else {
    const diff = getObjectDiff(oldProduct, newProduct) as IProduct
    updatedProduct = isEmpty(diff) ? oldProduct : await Products.Patch<IProduct>(oldProduct.ID, diff)
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
    const priceSchedule = await PriceSchedules.Patch<IPriceSchedule>(priceOverride.ID, diff)
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

/**
 *
 * @param newItems current list of items in their desired state (what we want them to be after updates)
 * @param keyId used to determine if an item is new, updated, or deleted, in most cases this is ID but
 * for entities where we allow users to modify ID (such as variants), we need to use ORIGINAL_ID
 * @returns
 */
function getItemsToAdd<TReturnType>(newItems: TReturnType[], keyId: string = "ID"): TReturnType[] {
  return (newItems || []).filter((newObject) => !newObject[keyId])
}

/**
 *
 * @param oldItems list of items in their original state (before updates)
 * @param newItems current list of items in their desired state (what we want them to be after updates)
 * @param keyId used to determine if an item is new, updated, or deleted, in most cases this is ID but
 * for entities where we allow users to modify ID (such as variants), we need to use ORIGINAL_ID
 * @returns
 */
function getItemsToUpdate<TReturnType>(oldItems, newItems: TReturnType[], keyId: string = "ID"): TReturnType[] {
  return (newItems || []).filter((newObject) => {
    const oldObject = (oldItems || []).find((oldObject) => oldObject.ID === newObject[keyId])
    if (oldObject) {
      const diff = getObjectDiff(oldObject, newObject)
      return !isEmpty(diff)
    }
  })
}

/**
 *
 * @param oldItems list of items in their original state (before updates)
 * @param newItems current list of items in their desired state (what we want them to be after updates)
 * @param keyId used to determine if an item is new, updated, or deleted, in most cases this is ID but
 * for entities where we allow users to modify ID (such as variants), we need to use ORIGINAL_ID
 * @returns
 */
function getItemsToDelete<TReturnType>(oldItems: TReturnType[], newItems, keyId: string = "ID"): TReturnType[] {
  return (oldItems || []).filter((oldObject) => {
    const newObject = (newItems || []).find((newObject) => newObject.ID === oldObject[keyId])
    if (!newObject) {
      return true
    }
  })
}

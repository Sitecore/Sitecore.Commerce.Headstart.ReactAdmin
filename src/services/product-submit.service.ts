import {isEmpty} from "lodash"
import {PriceSchedules, Products, ProductAssignment, Specs, SpecProductAssignment} from "ordercloud-javascript-sdk"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import {SpecFieldValues, SpecOptionFieldValues} from "types/form/SpecFieldValues"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {ISpec} from "types/ordercloud/ISpec"
import {getObjectDiff} from "utils"
import {v4 as randomId} from "uuid"
import {fetchOverridePriceSchedules, fetchSpecs} from "./product-data-fetcher.service"

export async function submitProduct(
  isCreatingNew: boolean,
  oldDefaultPriceSchedule: IPriceSchedule,
  newDefaultPriceSchedule: IPriceSchedule,
  oldProduct: IProduct,
  newProduct: IProduct,
  newFacets: any[],
  oldSpecs: ISpec[],
  newSpecs: SpecFieldValues[],
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
  const updatedProduct = await handleUpdateProduct(
    oldProduct,
    newProduct,
    newFacets,
    updatedDefaultPriceSchedule,
    isCreatingNew
  )

  // create/update/delete specs & spec options
  const updatedSpecs = await handleUpdateSpecs(oldSpecs, newSpecs, updatedProduct)

  // create/update/delete price overrides and related assignments
  const updatedPriceOverrides = await handleUpdatePriceOverrides(
    oldOverridePriceSchedules,
    newOverridePriceSchedules.filter((priceSchedule) => priceSchedule.PriceBreaks[0].Price),
    updatedProduct
  )

  return {updatedProduct, updatedSpecs, updatedPriceOverrides, updatedDefaultPriceSchedule}
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

const generateUpdatedFacets = (facets = []) => {
  const updatedFacetsOnProduct = {}

  facets.forEach((facet) => {
    const {ID, Options} = facet
    const filteredOptions = Options.filter((option) => option.value === true)

    if (filteredOptions.length > 0) {
      updatedFacetsOnProduct[ID] = filteredOptions.map((option) => option.facetOptionName)
    } else {
      updatedFacetsOnProduct[ID] = []
    }
  })

  return updatedFacetsOnProduct
}

async function handleUpdateProduct(
  oldProduct: IProduct,
  newProduct: IProduct,
  newFacets: any[],
  updatedPriceSchedule: IPriceSchedule,
  isCreatingNew: boolean
): Promise<IProduct> {
  let updatedProduct: IProduct
  const updatedFacetsOnProduct = generateUpdatedFacets(newFacets)
  if (isCreatingNew) {
    newProduct.DefaultPriceScheduleID = updatedPriceSchedule.ID
    if (!newProduct.xp) {
      newProduct.xp = {}
    }
    newProduct.xp.Facets = updatedFacetsOnProduct
    updatedProduct = await Products.Create<IProduct>(newProduct)
  } else {
    const diff = getObjectDiff(oldProduct, newProduct) as IProduct
    if (updatedFacetsOnProduct) {
      if (!diff.xp) {
        diff.xp = {}
      }
      diff.xp.Facets = updatedFacetsOnProduct
    }
    updatedProduct = await Products.Patch<IProduct>(oldProduct.ID, diff)
  }
  return updatedProduct
}

async function handleUpdatePriceOverrides(
  oldPriceSchedules: IPriceSchedule[],
  newPriceSchedules: OverridePriceScheduleFieldValues[],
  product: IProduct
) {
  const addPriceSchedules = getObjectsToAdd(newPriceSchedules)
  const updatePriceSchedules = getObjectsToUpdate(oldPriceSchedules, newPriceSchedules)
  const deletePriceSchedules = getObjectsToDelete(oldPriceSchedules, newPriceSchedules)

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
  const addSpecs = getObjectsToAdd(newSpecs)
  const updateSpecs = getObjectsToUpdate(oldSpecs, newSpecs)
  const deleteSpecs = getObjectsToDelete(oldSpecs, newSpecs)

  const addSpecRequests = addSpecs.map(async (spec) => {
    const newSpec = await Specs.Create<ISpec>(spec)
    const optionRequests = spec.Options.map((option) => Specs.CreateOption(newSpec.ID, option))
    await Promise.all(optionRequests)
    await Specs.SaveProductAssignment({SpecID: newSpec.ID, ProductID: product.ID})
  })

  const updateSpecRequests = updateSpecs.map(async (spec) => {
    const oldSpec = oldSpecs.find((oldSpec) => oldSpec.ID === spec.ID)
    const diff = getObjectDiff(oldSpec, spec)
    const updatedSpec = await Specs.Patch<ISpec>(spec.ID, diff)
    await handleUpdateSpecOptions(updatedSpec.ID, spec.Options)
  })

  const deleteSpecRequests = deleteSpecs.map(async (spec) => Specs.Delete(spec.ID))

  await Promise.all([...addSpecRequests, ...updateSpecRequests, ...deleteSpecRequests])
  return await fetchSpecs(product)
}

async function handleUpdateSpecOptions(specId, newOptions: SpecOptionFieldValues[]) {
  const oldOptions = await Specs.ListOptions(specId)

  const addOptions = getObjectsToAdd(newOptions)
  const updateOptions = getObjectsToUpdate(oldOptions.Items, newOptions)
  const deleteOptions = getObjectsToDelete(oldOptions.Items, newOptions)

  const addOptionRequests = addOptions.map(async (option) => Specs.CreateOption(specId, option))
  const updateOptionRequests = updateOptions.map(async (option) => Specs.PatchOption(specId, option.ID, option))
  const deleteOptionRequests = deleteOptions.map(async (option) => Specs.DeleteOption(specId, option.ID))

  await Promise.all([...addOptionRequests, ...updateOptionRequests, ...deleteOptionRequests])
}

function getObjectsToAdd<TReturnType>(newObjects: TReturnType[]): TReturnType[] {
  return (newObjects || []).filter((newObject) => !newObject["ID"])
}

function getObjectsToUpdate<TReturnType>(oldObjects, newObjects: TReturnType[]): TReturnType[] {
  return (newObjects || []).filter((newObject) => {
    const oldObject = (oldObjects || []).find((oldObject) => oldObject.ID === newObject["ID"])
    if (oldObject) {
      const diff = getObjectDiff(oldObject, newObject)
      return !isEmpty(diff)
    }
  })
}

function getObjectsToDelete<TReturnType>(oldObjects: TReturnType[], newObjects): TReturnType[] {
  return (oldObjects || []).filter((oldObject) => {
    const newObject = (newObjects || []).find((newObject) => newObject.ID === oldObject["ID"])
    if (!newObject) {
      return true
    }
  })
}

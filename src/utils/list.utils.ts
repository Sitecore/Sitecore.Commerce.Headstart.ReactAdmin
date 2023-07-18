import {isEmpty} from "lodash"
import {getObjectDiff} from "./object.utils"

/**
 *
 * @param newItems current list of items in their desired state (what we want them to be after updates)
 * @param keyId used to determine if an item is new, updated, or deleted, in most cases this is ID but
 * for entities where we allow users to modify ID (such as variants), we need to use ORIGINAL_ID
 * @returns
 */
export function getItemsToAdd<TReturnType>(newItems: TReturnType[], keyId: string = "ID"): TReturnType[] {
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
export function getItemsToUpdate<TReturnType>(oldItems, newItems: TReturnType[], keyId: string = "ID"): TReturnType[] {
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
export function getItemsToDelete<TReturnType>(oldItems: TReturnType[], newItems, keyId: string = "ID"): TReturnType[] {
  return (oldItems || []).filter((oldObject) => {
    const newObject = (newItems || []).find((newObject) => newObject.ID === oldObject[keyId])
    if (!newObject) {
      return true
    }
  })
}

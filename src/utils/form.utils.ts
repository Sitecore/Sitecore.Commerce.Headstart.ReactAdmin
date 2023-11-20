import {get, set} from "lodash"
import * as yup from "yup"

/**
 * It is desirable to visually mark a field as required by displaying an asterisk
 * react-hook-form doesn't have a way of doing this so we must pass down the validationSchema
 * and inspect it to determine if the field is required, this helper achieves that
 *
 */
export const isRequiredField = (validationSchema: any, name: string) => {
  if (!validationSchema) {
    return false
  }
  const schemaDescription = validationSchema.describe()
  const accessor = name.split(".").join(".fields.")
  const field = get(schemaDescription.fields, accessor)
  if (!field) {
    return false
  }
  const isRequired = field.tests.some((test) => test.name === "required")
  return isRequired
}

/**
 * Yup helper for allowing number types with a default value of empty string
 * Chakra doesn't allow null for inputs, and undefined is considered uncontrolled input
 * and we may not want to default a field to zero so this lets us define an "empty" field
 * without yup validation yelling at us when it hasn't been filled in and luckily
 * OrderCloud simply ignores empty strings
 */
export function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === "string" && originalValue === "") {
    return null
  }
  return value
}

export function nullToFalse(value, originalValue) {
  if (originalValue === null) {
    return false
  }
  return value
}

// regex matching OrderCloud's minimum password requirements
// 10 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, may contain special characters
// https://ordercloud.io/knowledge-base/custom-password-configuration
export const orderCloudPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?a-zA-Z\d\S]{10,}$/

// regex matching OrderCloud's ID requirements
// can include letters, numbers, dashes, and underscores, and can be at most 100 characters
export const orderCloudIDRegex = /^[\w-]*$/

import * as yup from "yup"
import {makeNestedValidationSchema} from "utils"
import {values} from "lodash"
import * as descriptionForm from "./DescriptionForm"
import * as detailsForm from "./DetailsForm"
import * as inventoryForm from "./InventoryForm"
import * as shippingForm from "./ShippingForm"
import * as unitOfMeasureForm from "./UnitOfMeasureForm"

export const defaultValues = {
  ...descriptionForm.defaultValues,
  ...detailsForm.defaultValues,
  ...inventoryForm.defaultValues,
  ...shippingForm.defaultValues,
  ...unitOfMeasureForm.defaultValues
}

export const validationSchema = yup.object().shape(
  makeNestedValidationSchema({
    ...descriptionForm.formShape,
    ...detailsForm.formShape,
    ...inventoryForm.formShape,
    ...shippingForm.formShape,
    ...unitOfMeasureForm.formShape
  })
)

export const tabFieldNames = {
  Details: [
    ...values(descriptionForm.fieldNames),
    ...values(detailsForm.fieldNames),
    ...values(inventoryForm.fieldNames),
    ...values(shippingForm.fieldNames),
    ...values(unitOfMeasureForm.fieldNames)
  ],
  Pricing: [],
  Variants: [],
  Media: [],
  Facets: [],
  SEO: []
}

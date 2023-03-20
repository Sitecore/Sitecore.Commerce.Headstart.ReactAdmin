import * as yup from "yup"
import {makeNestedValidationSchema} from "utils"
import {values} from "lodash"

// form shapes
import descriptionFormShape from "./DescriptionForm/formShape"
import detailsFormShape from "./DetailsForm/formShape"
import inventoryFormShape from "./InventoryForm/formShape"
import shippingFormShape from "./ShippingForm/formShape"
import unitOfMeasureFormShape from "./UnitOfMeasureForm/formShape"

// form initial values
import descriptionFormInitialValues from "./DescriptionForm/defaultValues"
import detailsFormInitialValues from "./DetailsForm/defaultValues"
import inventoryFormInitialValues from "./InventoryForm/defaultValues"
import shippingFormInitialValues from "./ShippingForm/defaultValues"
import unitOfMeasureFormInitialValues from "./UnitOfMeasureForm/defaultValues"

// form fields
import * as descriptionFormFields from "./DescriptionForm/fieldNames"
import * as detailsFormFields from "./DetailsForm/fieldNames"
import * as inventoryFormFields from "./InventoryForm/fieldNames"
import * as shippingFormFields from "./ShippingForm/fieldNames"
import * as unitOfMeasureFormFields from "./UnitOfMeasureForm/fieldNames"

// form field names
const descriptionFormFieldNames = values(descriptionFormFields)
const detailsFormFieldNames = values(detailsFormFields)
const inventoryFormFieldNames = values(inventoryFormFields)
const shippingFormFieldNames = values(shippingFormFields)
const unitOfMeasureFormFieldNames = values(unitOfMeasureFormFields)

export const defaultValues = {
  ...descriptionFormInitialValues,
  ...detailsFormInitialValues,
  ...inventoryFormInitialValues,
  ...shippingFormInitialValues,
  ...unitOfMeasureFormInitialValues
}

export const validationSchema = yup.object().shape(
  makeNestedValidationSchema({
    ...descriptionFormShape,
    ...detailsFormShape,
    ...inventoryFormShape,
    ...shippingFormShape,
    ...unitOfMeasureFormShape
  })
)

export const tabFieldNames = {
  Details: [
    ...descriptionFormFieldNames,
    ...detailsFormFieldNames,
    ...inventoryFormFieldNames,
    ...shippingFormFieldNames,
    ...unitOfMeasureFormFieldNames
  ],
  Pricing: [],
  Variants: [],
  Media: [],
  Facets: [],
  SEO: []
}

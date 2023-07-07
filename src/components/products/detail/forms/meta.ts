import * as yup from "yup"
import {makeNestedValidationSchema} from "utils"
import {mapKeys, values} from "lodash"
import * as descriptionForm from "./DescriptionForm"
import * as detailsForm from "./DetailsForm"
import * as inventoryForm from "./InventoryForm"
import * as shippingForm from "./ShippingForm"
import * as unitOfMeasureForm from "./UnitOfMeasureForm"
import * as pricingForm from "./PricingForm"
import * as facetsForm from "./FacetsForm"
import * as mediaForm from "./MediaForm"
import {ProductDetailTab} from "../ProductDetail"
import * as catalogForm from "./CatalogForm"

export const defaultValues = {
  ...descriptionForm.defaultValues,
  ...detailsForm.defaultValues,
  ...inventoryForm.defaultValues,
  ...shippingForm.defaultValues,
  ...unitOfMeasureForm.defaultValues,
  // Pricing is a special case because its used for both default price schedule as well as override price schedules
  ...mapKeys(pricingForm.defaultValues, (value, key) => `DefaultPriceSchedule.${key}`),
  ...facetsForm.defaultValues,
  ...mediaForm.defaultValues,
  ...mapKeys(catalogForm.defaultValues, (value, key) => `CatalogAssignments.${key}`),
  Specs: [],
  Variants: [],
  OverridePriceSchedules: [],
  CatalogAssignments: [],
  CategoryAssignments: []
}

export const validationSchema = yup.object().shape(
  makeNestedValidationSchema({
    ...descriptionForm.formShape,
    ...detailsForm.formShape,
    ...inventoryForm.formShape,
    ...shippingForm.formShape,
    ...unitOfMeasureForm.formShape,
    // Pricing is a special case because its used for both default price schedule as well as override price schedules
    ...mapKeys(pricingForm.formShape, (value, key) => `DefaultPriceSchedule.${key}`),
    OverridePriceSchedules: yup.array().of(yup.object().shape(pricingForm.formShape)),
    Variants: yup.array().of(
      yup.object().shape({
        ID: yup
          .string()
          .matches(/^[\w-]+$/, "ID must be alphanumeric (may also include dashes or underscores)")
          .required("Required"),
        Active: yup.bool()
      })
    ),
    ...facetsForm.formShape,
    ...mediaForm.formShape
  })
)

export const tabFieldNames: Record<ProductDetailTab, any[]> = {
  Details: [
    ...values(descriptionForm.fieldNames),
    ...values(detailsForm.fieldNames),
    ...values(inventoryForm.fieldNames),
    ...values(shippingForm.fieldNames),
    ...values(unitOfMeasureForm.fieldNames)
  ],
  Pricing: [
    // Pricing is a special case because its used for both default price schedule as well as override price schedules
    ...values(pricingForm.fieldNames).map((fieldName) => `DefaultPriceSchedule.${fieldName}`),
    ...values(pricingForm.fieldNames).map((fieldName) => `OverridePriceSchedules.${fieldName}`)
  ],
  Variants: [],
  Media: [...values(mediaForm.fieldNames)],
  Facets: [...values(facetsForm.fieldNames)],
  Customization: [],
  Catalogs: [...values(catalogForm.fieldNames).map((fieldName) => `CatalogAssignments.${fieldName}`)]
}

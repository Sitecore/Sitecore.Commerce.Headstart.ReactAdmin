import {InfoOutlineIcon} from "@chakra-ui/icons"
import {Tab} from "@chakra-ui/react"
import {isEmpty, get} from "lodash"
import {Control, useFormState, FieldErrors} from "react-hook-form"
import {ProductDetailFormFields, tabFieldNames} from "./form-meta"
import {ProductDetailTab} from "./ProductDetail"

interface ProductDetailTabProps {
  tab: ProductDetailTab
  control: Control<ProductDetailFormFields>
}

export function ProductDetailTab({control, tab}: ProductDetailTabProps) {
  // This is its own component so that when we retrieve form state via the useFormState hook
  // we isolate changes to just this component and don't cause the entire product detail page to re-render
  const {errors} = useFormState({control})
  const tabHasError = (tab: ProductDetailTab, errors: FieldErrors<any>): boolean => {
    if (isEmpty(errors)) {
      return false
    }
    return tabFieldNames[tab].some((fieldName) => get(errors, fieldName, null))
  }

  return (
    <Tab>
      {tab} {tabHasError(tab, errors) && <InfoOutlineIcon color="danger.500" marginLeft={2} />}
    </Tab>
  )
}

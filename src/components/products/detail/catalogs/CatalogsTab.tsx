import {Control} from "react-hook-form"
import {CategoriesCard} from "./categories/CategoriesCard"
import {ProductDetailFormFields} from "../form-meta"
import {CatalogsCard} from "./CatalogsCard"

interface CatalogsTabProps {
  control: Control<ProductDetailFormFields>
}
export function CatalogsTab({control}: CatalogsTabProps) {
  return (
    <>
      <CatalogsCard control={control} />
      <CategoriesCard control={control} />
    </>
  )
}

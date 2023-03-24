import ExportToCsv from "@/components/demo/ExportToCsv"
import LanguageSelector from "@/components/demo/LanguageSelector"
import ViewProduct from "@/components/demo/ViewProduct"
import Link from "next/link"
import ConfirmDelete from "@/components/shared/ConfirmDelete"
import {Box, Button, Stack} from "@chakra-ui/react"
import {useRouter} from "hooks/useRouter"
import {Products} from "ordercloud-javascript-sdk"
import React, {useState} from "react"
import {Control, FieldValues, UseFormReset} from "react-hook-form"
import {IProduct} from "types/ordercloud/IProduct"
import {ProductDetailTab} from "./ProductDetail"
import ViewManager from "./ViewManager"
import SubmitButton from "@/components/react-hook-form/submit-button"
import ResetButton from "@/components/react-hook-form/reset-button"

interface ProductDetailToolbarProps {
  product: IProduct
  control: Control<FieldValues, any>
  resetForm: UseFormReset<any>
  viewVisibility: Record<ProductDetailTab, boolean>
  setViewVisibility: (update: Record<ProductDetailTab, boolean>) => void
}

export default function ProductDetailToolbar({
  product,
  control,
  resetForm,
  viewVisibility,
  setViewVisibility
}: ProductDetailToolbarProps) {
  const router = useRouter()
  const [deleteLoading, setDeleteLoading] = useState(false)

  const onDelete = async () => {
    try {
      await Products.Delete(product?.ID)
      router.push("/products")
    } finally {
      setDeleteLoading(true)
    }
  }

  return (
    <Stack direction="row" mb={5}>
      <ViewManager viewVisibility={viewVisibility} setViewVisibility={setViewVisibility} />
      <Link href="/products/new">
        <Button variant="outline">Create</Button>
      </Link>
      <ViewProduct />
      <ExportToCsv />
      <LanguageSelector />
      <ConfirmDelete deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
      <Box as="span" flexGrow="1"></Box>

      <ResetButton control={control} reset={resetForm}>
        Discard Changes
      </ResetButton>
      <SubmitButton control={control} variant="solid" colorScheme="primary">
        Save
      </SubmitButton>
    </Stack>
  )
}

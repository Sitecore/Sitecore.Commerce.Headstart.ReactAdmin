import ExportToCsv from "@/components/demo/ExportToCsv"
import LanguageSelector from "@/components/demo/LanguageSelector"
import ViewProduct from "@/components/demo/ViewProduct"
import Link from "next/link"
import ConfirmDelete from "@/components/shared/ConfirmDelete"
import {Box, Button, Stack} from "@chakra-ui/react"
import {useRouter} from "hooks/useRouter"
import {Products} from "ordercloud-javascript-sdk"
import React, {useState} from "react"
import {UseFormReset} from "react-hook-form"
import {IProduct} from "types/ordercloud/IProduct"
import {ProductDetailTab} from "./ProductDetail"
import ViewManager from "./ViewManager"

interface ProductDetailToolbarProps {
  product?: IProduct
  isFormValid?: boolean
  resetForm?: UseFormReset<any>
  viewVisibility: Record<ProductDetailTab, boolean>
  setViewVisibility: (update: Record<ProductDetailTab, boolean>) => void
}

export default function ProductDetailToolbar({
  product,
  isFormValid,
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

  const discardChanges = () => {
    resetForm()
  }

  return (
    <Stack direction="row" mb={5}>
      <ViewManager viewVisibility={viewVisibility} setViewVisibility={setViewVisibility} />
      <Link href="/products/new">
        <Button variant="secondaryButton">Create</Button>
      </Link>
      <ViewProduct />
      <ExportToCsv />
      <LanguageSelector />
      <ConfirmDelete deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
      <Box as="span" flexGrow="1"></Box>

      <Button type="button" onClick={discardChanges}>
        Discard Changes
      </Button>
      <Button type="submit" variant="primaryButton" isDisabled={!isFormValid}>
        Save
      </Button>
    </Stack>
  )
}

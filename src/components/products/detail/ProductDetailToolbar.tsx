import ExportToCsv from "@/components/demo/ExportToCsv"
import LanguageSelector from "@/components/demo/LanguageSelector"
import ViewProduct from "@/components/demo/ViewProduct"
import {Link} from "@/components/navigation/Link"
import ConfirmDelete from "@/components/shared/ConfirmDelete"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Box, Button, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text} from "@chakra-ui/react"
import {FormikState} from "formik"
import {useRouter} from "hooks/useRouter"
import {Products} from "ordercloud-javascript-sdk"
import React, {useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import {ProductDetailTab} from "./ProductDetail"
import ViewManager from "./ViewManager"

interface ProductDetailToolbarProps {
  product?: IProduct
  isFormValid?: boolean
  resetForm?: (nextState?: Partial<FormikState<any>>) => void
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
      <Menu>
        <MenuButton aria-label={`Product action menu for ${product?.Name}`} type="button">
          <HStack>
            <Text>Actions </Text>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
        <MenuList>
          <Link href="/products/new">
            <MenuItem>Create</MenuItem>
          </Link>
          <ViewProduct variant="menuitem" />
          <ExportToCsv variant="menuitem" />
          <LanguageSelector variant="menuitem" />
          <MenuDivider />
          <ConfirmDelete variant="menuitem" deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
        </MenuList>
      </Menu>
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

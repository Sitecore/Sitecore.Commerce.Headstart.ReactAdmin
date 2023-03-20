import ExportToCsv from "@/components/demo/ExportToCsv"
import LanguageSelector from "@/components/demo/LanguageSelector"
import ViewProduct from "@/components/demo/ViewProduct"
import {Link} from "@/components/navigation/Link"
import ConfirmDelete from "@/components/shared/ConfirmDelete"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Box, Button, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text} from "@chakra-ui/react"
import {useRouter} from "hooks/useRouter"
import {Products} from "ordercloud-javascript-sdk"
import React, {useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import ViewManager from "./ViewManager"

interface ProductDetailToolbarProps {
  product?: IProduct
  isFormValid?: boolean
}

export default function ProductDetailToolbar({product, isFormValid}: ProductDetailToolbarProps) {
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
      <ViewManager />
      <Menu>
        <MenuButton aria-label={`Product action menu for ${product?.Name}`} type="button">
          <HStack>
            <Text>Actions </Text>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} href={`/products/${product?.ID}`}>
            Create
          </MenuItem>
          <ViewProduct variant="menuitem" />
          <ExportToCsv variant="menuitem" />
          <LanguageSelector variant="menuitem" />
          <MenuDivider />
          <ConfirmDelete variant="menuitem" deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
        </MenuList>
      </Menu>
      <Box as="span" flexGrow="1"></Box>

      <Button type="submit" variant="primaryButton" isDisabled={!isFormValid}>
        Save
      </Button>
    </Stack>
  )
}

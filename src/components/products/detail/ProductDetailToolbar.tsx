import ExportToCsv from "@/components/demo/ExportToCsv"
import LanguageSelector from "@/components/demo/LanguageSelector"
import ViewProduct from "@/components/demo/ViewProduct"
import Link from "next/link"
import ConfirmDelete from "@/components/shared/ConfirmDelete"
import {
  Box,
  Button,
  Hide,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  theme,
  useMediaQuery
} from "@chakra-ui/react"
import {useRouter} from "hooks/useRouter"
import {Products} from "ordercloud-javascript-sdk"
import React, {useState} from "react"
import {Control, FieldValues, UseFormReset} from "react-hook-form"
import {IProduct} from "types/ordercloud/IProduct"
import {ProductDetailTab} from "./ProductDetail"
import ViewManager from "./ViewManager"
import SubmitButton from "@/components/react-hook-form/submit-button"
import ResetButton from "@/components/react-hook-form/reset-button"
import {HamburgerIcon, AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon} from "@chakra-ui/icons"
import {TbLanguage, TbPlus, TbShoppingCartPlus, TbTableExport, TbTrash} from "react-icons/tb"

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

  const [belowMd] = useMediaQuery(`(max-width: ${theme.breakpoints["md"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  const onDelete = async () => {
    try {
      await Products.Delete(product?.ID)
      router.push("/products")
    } finally {
      setDeleteLoading(true)
    }
  }

  return (
    <>
      <Hide below="xl">
        <Stack direction="row" mb={5} w="100%">
          <ViewManager viewVisibility={viewVisibility} setViewVisibility={setViewVisibility} />
          <Link href="/products/new">
            <Button variant="outline">Create</Button>
          </Link>
          <ViewProduct />
          <ExportToCsv />
          <LanguageSelector />
          <ConfirmDelete deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
          <HStack flexGrow="1" justifyContent={"flex-end"} gap={1}>
            <ResetButton control={control} reset={resetForm}>
              Discard Changes
            </ResetButton>
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Save
            </SubmitButton>
          </HStack>
        </Stack>
      </Hide>

      {/* Mobile Hamburger Menu */}
      <Hide above="xl">
        <HStack justify={"space-between"} alignItems="stretch" wrap="wrap">
          <ViewManager viewVisibility={viewVisibility} setViewVisibility={setViewVisibility} />
          <Menu>
            <MenuButton
              style={{marginRight: "auto"}}
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <Link href="/products/new" passHref>
                <MenuItem as="a" icon={<TbPlus size={"1rem"} />}>
                  Create
                </MenuItem>
              </Link>
              <ViewProduct />
              <ExportToCsv />
              <LanguageSelector />
              <ConfirmDelete deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
            </MenuList>
          </Menu>

          <HStack justifyContent={"flex-end"} ml="auto !important">
            <ResetButton control={control} reset={resetForm}>
              Discard Changes
            </ResetButton>
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Save
            </SubmitButton>
          </HStack>
        </HStack>
      </Hide>
    </>
  )
}

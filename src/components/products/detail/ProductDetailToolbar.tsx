import ExportToCsv from "@/components/demo/ExportToCsv"
import LanguageSelector from "@/components/demo/LanguageSelector"
import ViewProduct from "@/components/demo/ViewProduct"
import Link from "next/link"
import ConfirmDelete from "@/components/shared/ConfirmDelete"
import {Button, Hide, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text} from "@chakra-ui/react"
import {useRouter} from "hooks/useRouter"
import {Products} from "ordercloud-javascript-sdk"
import React, {useState} from "react"
import {Control, UseFormReset} from "react-hook-form"
import {IProduct} from "types/ordercloud/IProduct"
import {ProductDetailTab} from "./ProductDetail"
import ViewManager from "./ViewManager"
import SubmitButton from "@/components/react-hook-form/submit-button"
import ResetButton from "@/components/react-hook-form/reset-button"
import {HamburgerIcon} from "@chakra-ui/icons"
import {TbPlus} from "react-icons/tb"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {ProductDetailFormFields} from "./form-meta"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface ProductDetailToolbarProps {
  product: IProduct
  control: Control<ProductDetailFormFields>
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
      setDeleteLoading(true)
      await Products.Delete(product?.ID)
      router.push("/products")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <Hide below="xl">
        <Stack direction="row" mb={5} w="100%">
          <ViewManager viewVisibility={viewVisibility} setViewVisibility={setViewVisibility} />

          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <>
              <Menu>
                <MenuButton as={Button} variant="outline" width={"max-content"}>
                  <HStack>
                    <Text>Actions</Text>
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <ViewProduct />
                  <ExportToCsv variant="menuitem" />
                  <LanguageSelector />
                  <ConfirmDelete deleteText="Delete Product" loading={deleteLoading} onDelete={onDelete} />
                </MenuList>
              </Menu>
              <HStack flexGrow="1" justifyContent={"flex-end"} gap={1}>
                <ResetButton control={control} reset={resetForm}>
                  Discard Changes
                </ResetButton>
                <SubmitButton control={control} variant="solid" colorScheme="primary">
                  Save
                </SubmitButton>
              </HStack>
            </>
          </ProtectedContent>
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
              <ExportToCsv variant="menuitem" />
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

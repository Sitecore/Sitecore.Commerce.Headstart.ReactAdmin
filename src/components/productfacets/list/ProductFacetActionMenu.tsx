import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {IProductFacet} from "types/ordercloud/IProductFacet"

interface IProductFacetActionMenu {
  productFacet: IProductFacet
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const ProductFacetActionMenu: FC<IProductFacetActionMenu> = ({productFacet, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductFacetManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton as={IconButton} aria-label={`Product facet action menu for ${productFacet.Name}`} variant="ghost">
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`productfacets/${productFacet.ID}`}>
            <MenuItem as="a" justifyContent="space-between">
              Edit <EditIcon />
            </MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem justifyContent="space-between" color="red.500" onClick={onDelete}>
            Delete <DeleteIcon />
          </MenuItem>
        </MenuList>
      </Menu>
    </ProtectedContent>
  )
}

export default ProductFacetActionMenu

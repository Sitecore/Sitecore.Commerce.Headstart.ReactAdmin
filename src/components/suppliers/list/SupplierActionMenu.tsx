import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {ISupplier} from "types/ordercloud/ISupplier"

interface ISupplierActionMenu {
  supplier: ISupplier
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const SupplierActionMenu: FC<ISupplierActionMenu> = ({supplier, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton as={IconButton} aria-label={`Admin user action menu for ${supplier.Name}`} variant="ghost">
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`suppliers/${supplier.ID}`}>
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

export default SupplierActionMenu

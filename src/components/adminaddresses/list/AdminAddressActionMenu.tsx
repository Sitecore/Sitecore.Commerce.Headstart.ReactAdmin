import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"

interface IAdminAddressActionMenu {
  adminAddress: IAdminAddress
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const AdminAddressActionMenu: FC<IAdminAddressActionMenu> = ({adminAddress, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.AdminAddressManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton
          as={IconButton}
          aria-label={`Admin address action menu for ${adminAddress.AddressName}`}
          variant="ghost"
        >
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`adminaddresses/${adminAddress.ID}`}>
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

export default AdminAddressActionMenu

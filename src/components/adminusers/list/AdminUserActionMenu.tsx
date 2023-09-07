import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {IAdminUser} from "types/ordercloud/IAdminUser"

interface IAdminUserActionMenu {
  adminUser: IAdminUser
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const AdminUserActionMenu: FC<IAdminUserActionMenu> = ({adminUser, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.AdminUserManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton as={IconButton} aria-label={`Admin user action menu for ${adminUser.FirstName}`} variant="ghost">
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`adminusers/${adminUser.ID}`}>
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

export default AdminUserActionMenu

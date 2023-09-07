import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"

interface IBuyerUserGroupActionMenu {
  buyerid: string
  usergroup: IBuyerUserGroup
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const BuyerUserGroupActionMenu: FC<IBuyerUserGroupActionMenu> = ({buyerid, usergroup, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerUserGroupManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton
          as={IconButton}
          aria-label={`Action menu for ${usergroup.Name}`}
          variant="ghost"
          colorScheme="secondary"
        >
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`/buyers/${buyerid}/usergroups/${usergroup.ID}`}>
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

export default BuyerUserGroupActionMenu

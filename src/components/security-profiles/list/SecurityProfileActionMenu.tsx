import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {SecurityProfile} from "ordercloud-javascript-sdk"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"

interface ISecurityProfileActionMenu {
  securityProfile: SecurityProfile
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const SecurityProfileActionMenu: FC<ISecurityProfileActionMenu> = ({securityProfile, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton
          as={IconButton}
          aria-label={`Security profile action menu for ${securityProfile.Name}`}
          variant="ghost"
        >
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`securityprofiles/${securityProfile.ID}`}>
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

export default SecurityProfileActionMenu

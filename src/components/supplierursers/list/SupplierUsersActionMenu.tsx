import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"

interface ISupplierUsersActionMenu {
  supplierid: string
  supplieruser: ISupplierUser
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const SupplierUsersActionMenu: FC<ISupplierUsersActionMenu> = ({supplierid, supplieruser: supplieruser, onOpen, onClose, onDelete}) => {
  return (
    <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
      <MenuButton
        as={IconButton}
        aria-label={`Action menu for ${supplieruser.FirstName} ${supplieruser.LastName}`}
        variant="ghost"
        colorScheme="secondary"
      >
        <Icon as={TbDotsVertical} mt={1} />
      </MenuButton>
      <MenuList>
        <Link passHref href={`/suppliers/${supplierid}/users/${supplieruser.ID}`}>
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
  )
}

export default SupplierUsersActionMenu

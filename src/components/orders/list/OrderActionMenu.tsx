import ProtectedContent from "@/components/auth/ProtectedContent"
import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {IOrder} from "types/ordercloud/IOrder"

interface IOrderActionMenu {
  order: IOrder
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const OrderActionMenu: FC<IOrderActionMenu> = ({order, onOpen, onClose, onDelete}) => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton as={IconButton} aria-label={`Admin user action menu for Order Return ${order.ID}`} variant="ghost">
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`orders/${order.ID}`}>
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

export default OrderActionMenu

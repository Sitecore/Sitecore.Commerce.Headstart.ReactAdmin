import ProtectedContent from "@/components/auth/ProtectedContent"
import {ArrowForwardIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"

interface IOrderReturnActionMenu {
  orderReturn: IOrderReturn
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
}

const OrderReturnActionMenu: FC<IOrderReturnActionMenu> = ({orderReturn, onOpen, onClose, onDelete}) => {
  return (
    <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
      <MenuButton
        as={IconButton}
        aria-label={`Admin user action menu for Order Return ${orderReturn.ID}`}
        variant="ghost"
      >
        <Icon as={TbDotsVertical} mt={1} />
      </MenuButton>
      <MenuList>
        <ProtectedContent hasAccess={appPermissions.OrderManager}>
          <Link passHref href={`returns/${orderReturn.ID}`}>
            <MenuItem as="a" justifyContent="space-between">
              Edit <EditIcon />
            </MenuItem>
          </Link>
        </ProtectedContent>
        <Link passHref href={`orders/${orderReturn.OrderID}`}>
          <MenuItem as="a" justifyContent="space-between">
            View Order <ArrowForwardIcon />
          </MenuItem>
        </Link>
        <ProtectedContent hasAccess={appPermissions.OrderManager}>
          <>
            <MenuDivider />
            <MenuItem justifyContent="space-between" color="red.500" onClick={onDelete}>
              Delete <DeleteIcon />
            </MenuItem>
          </>
        </ProtectedContent>
      </MenuList>
    </Menu>
  )
}

export default OrderReturnActionMenu

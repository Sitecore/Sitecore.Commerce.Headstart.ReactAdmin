import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import {TbDotsVertical, TbSpeakerphone} from "react-icons/tb"
import {IProduct} from "types/ordercloud/IProduct"

interface IProductActionMenu {
  product: IProduct
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
  onPromote: () => void
}

const ProductActionMenu: FC<IProductActionMenu> = ({product, onOpen, onClose, onDelete, onPromote}) => {
  return (
    <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose}>
      <MenuButton as={IconButton} aria-label={`Product action menu for ${product.Name}`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="blackAlpha.400" />
      </MenuButton>
      <MenuList>
        <Link passHref href={`/products/${product.ID}`}>
          <MenuItem as="a" justifyContent="space-between">
            Edit <EditIcon />
          </MenuItem>
        </Link>
        <MenuItem justifyContent="space-between" onClick={onPromote}>
          Promote <Icon as={TbSpeakerphone} transform={"rotate(-35deg)"} fontSize="1.15em" strokeWidth="1.7" />
        </MenuItem>
        <MenuDivider />
        <MenuItem justifyContent="space-between" color="danger" onClick={onDelete}>
          Delete <DeleteIcon />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProductActionMenu

import {Menu, MenuButton, IconButton, Icon, MenuList, MenuItem} from "@chakra-ui/react"
import {TbDotsVertical} from "react-icons/tb"

interface BuyersActionMenuProps {
  onDeleteAssignment: () => void
}

export function BuyerActionMenu({onDeleteAssignment}: BuyersActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`Buyer Assignment action menu`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="chakra-subtle-color" />
      </MenuButton>
      <MenuList>
        <MenuItem justifyContent="space-between" color="red.500" onClick={onDeleteAssignment}>
          Remove assignment
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

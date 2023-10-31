import {Menu, MenuButton, IconButton, Icon, MenuList, MenuItem} from "@chakra-ui/react"
import {TbDotsVertical} from "react-icons/tb"

interface UserGroupActionMenuProps {
  onDeleteAssignment: () => void
}

export function UserGroupActionMenu({onDeleteAssignment}: UserGroupActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`UserGroup Assignment action menu`} variant="ghost">
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

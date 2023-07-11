import {Menu, MenuButton, IconButton, Icon, MenuList, MenuItem} from "@chakra-ui/react"
import {TbDotsVertical} from "react-icons/tb"

interface CategoryActionMenuProps {
  onDeleteAssignment: () => void
}

export function CategoryActionMenu({onDeleteAssignment}: CategoryActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`Category Assignment action menu`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="blackAlpha.400" />
      </MenuButton>
      <MenuList>
        <MenuItem justifyContent="space-between" color="red.500" onClick={onDeleteAssignment}>
          Remove assignment
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react"

const ProductFilters = () => {
  return (
    <Menu>
      <MenuButton as={Button} variant="outline">
        Filter <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => {}}>Active</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProductFilters

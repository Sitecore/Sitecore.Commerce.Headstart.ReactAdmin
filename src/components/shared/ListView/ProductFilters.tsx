import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react"

const ProductFilters = () => {
  return (
    <Menu>
      <MenuButton as={Button} variant="secondaryButton" colorScheme="white">
        Filter <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuItem>Active</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProductFilters

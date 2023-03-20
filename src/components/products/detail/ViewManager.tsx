import {ChevronDownIcon} from "@chakra-ui/icons"
import {
  Menu,
  MenuButton,
  HStack,
  MenuList,
  MenuItem,
  VStack,
  CheckboxGroup,
  SimpleGrid,
  Checkbox,
  Text
} from "@chakra-ui/react"

interface ViewMangerProps {}

export default function ViewManager({}: ViewMangerProps) {
  return (
    <Menu>
      <MenuButton
        type="button"
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{bg: "gray.400"}}
        _expanded={{bg: "blue.400"}}
        _focus={{boxShadow: "outline"}}
      >
        <HStack>
          <Text>Views </Text>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem>
          <VStack>
            <Text>Manage Product Views</Text>
            <CheckboxGroup>
              <SimpleGrid columns={3} spacing={3}>
                <Checkbox value="ProductData" defaultChecked>
                  Product Data
                </Checkbox>
                <Checkbox value="Media" defaultChecked>
                  Media
                </Checkbox>
                <Checkbox value="ExtededProperties" defaultChecked>
                  Extended Properties
                </Checkbox>
                <Checkbox value="CatalogAssignments">Catalog Assignments</Checkbox>
                <Checkbox value="Inventory">Inventory</Checkbox>
                <Checkbox value="PriceSchedule">Price Schedule</Checkbox>
                <Checkbox value="Suppliers">Suppliers</Checkbox>
                <Checkbox value="Sizes">Sizes</Checkbox>
                <Checkbox value="Specs">Specs</Checkbox>
                <Checkbox value="Variants">Variants</Checkbox>
                <Checkbox value="InventoryRecords">Inventory Records</Checkbox>
              </SimpleGrid>
            </CheckboxGroup>
          </VStack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

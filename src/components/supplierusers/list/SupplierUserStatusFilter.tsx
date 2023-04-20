import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tag, Text} from "@chakra-ui/react"
import {FC} from "react"

interface ISupplierUsersStatusFilter {
  value: any
  onChange: (newValue: any) => void
}

const SupplierUserStatusFilter: FC<ISupplierUsersStatusFilter> = ({value, onChange}) => {
  return (
    <Menu>
      <MenuButton as={Button} py={0} variant="outline">
        <HStack alignContent="center" h="100%">
          <Text>Status</Text>
          <Tag colorScheme={value && value.length ? (value === "true" ? "success" : "danger") : "default"}>
            {value && value.length ? (value === "true" ? "Active" : "Inactive") : "Any"}
          </Tag>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={value} title="Filter by status" type="radio" onChange={onChange}>
          <MenuItemOption value={""}>Any</MenuItemOption>
          <MenuItemOption value="true">Active</MenuItemOption>
          <MenuItemOption value="false">Inactive</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

export default SupplierUserStatusFilter

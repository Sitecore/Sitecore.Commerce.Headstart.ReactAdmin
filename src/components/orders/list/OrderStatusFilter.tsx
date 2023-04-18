import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tag, Text} from "@chakra-ui/react"
import {FC} from "react"
import {OrderStatusColorSchemeMap} from "./OrderList"

interface IOrderStatusFilter {
  value: any
  onChange: (newValue: any) => void
}

const OrderStatusFilter: FC<IOrderStatusFilter> = ({value, onChange}) => {
  return (
    <Menu>
      <MenuButton as={Button} py={0} variant="outline">
        <HStack alignContent="center" h="100%">
          <Text>Status</Text>
          <Tag colorScheme={OrderStatusColorSchemeMap[value] || "default"}>{value || "Any"}</Tag>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={value} title="Filter by status" type="radio" onChange={onChange}>
          <MenuItemOption value={""}>Any</MenuItemOption>
          <MenuItemOption value="Unsubmitted">Unsubmitted</MenuItemOption>
          <MenuItemOption value="Open">Open</MenuItemOption>
          <MenuItemOption value="Canceled">Canceled</MenuItemOption>
          <MenuItemOption value="AwaitingApproval">Awaiting Approval</MenuItemOption>
          <MenuItemOption value="Declined">Declined</MenuItemOption>
          <MenuItemOption value="Completed">Completed</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

export default OrderStatusFilter

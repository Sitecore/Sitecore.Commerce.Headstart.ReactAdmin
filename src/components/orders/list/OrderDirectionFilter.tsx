import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Tag, Text} from "@chakra-ui/react"
import {useAuth} from "hooks/useAuth"

interface OrderDirectionFilterProps {
  value: any
  onChange: (newValue: string) => void
}
export function OrderDirectionFilter({value = "Incoming", onChange}: OrderDirectionFilterProps) {
  const {isSupplier} = useAuth()
  if (isSupplier) return null
  return (
    <Menu>
      <MenuButton as={Button} py={0} variant="outline" minW="auto">
        <HStack alignContent="center" h="100%">
          <Text>Direction</Text>
          <Tag colorScheme="default">{value}</Tag>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={value} title="Filter by order direction" type="radio" onChange={onChange}>
          <MenuItemOption value="Incoming">Incoming</MenuItemOption>
          <MenuItemOption value="Outgoing">Outgoing</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

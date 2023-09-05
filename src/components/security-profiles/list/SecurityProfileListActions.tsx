import ExportToCsv from "@/components/demo/ExportToCsv"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {FC} from "react"

const SecurityProfileListActions: FC = () => {
  return (
    <Menu>
      <MenuButton as={Button} variant="outline">
        <HStack>
          <Text>Actions</Text>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <ExportToCsv variant="menuitem" />
      </MenuList>
    </Menu>
  )
}

export default SecurityProfileListActions

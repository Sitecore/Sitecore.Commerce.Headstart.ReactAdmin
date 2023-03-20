import ExportToCsv from "@/components/demo/ExportToCsv"
import {ChevronDownIcon, DeleteIcon, DownloadIcon, EditIcon, SettingsIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {FC, useMemo} from "react"

interface IProductListActions {
  selected?: string[]
}
// title={`${selected.length} selected product${selected.length === 1 ? "" : "s"}`}
const ProductListActions: FC<IProductListActions> = ({selected}) => {
  const hasBulkSelection = useMemo(() => {
    return selected && selected.length > 1
  }, [selected])
  return (
    <Menu>
      <MenuButton as={Button} variant="secondaryButton" colorScheme="white">
        <HStack>
          <Text>Actions</Text>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem justifyContent="space-between">
          Bulk Import <DownloadIcon />
        </MenuItem>
        <ExportToCsv variant="menuitem" />
        <MenuDivider />
        <MenuItem justifyContent="space-between" isDisabled={!hasBulkSelection}>
          Bulk Edit <EditIcon />
        </MenuItem>
        <MenuItem color="blue.500" justifyContent="space-between" isDisabled={!hasBulkSelection}>
          Promote Products <SettingsIcon />
        </MenuItem>
        <MenuItem justifyContent="space-between" color="red.500" isDisabled={!hasBulkSelection}>
          Delete Products <DeleteIcon />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ProductListActions

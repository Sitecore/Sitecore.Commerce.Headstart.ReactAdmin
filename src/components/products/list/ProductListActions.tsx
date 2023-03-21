import BulkImport from "@/components/demo/BulkImport"
import ExportToCsv from "@/components/demo/ExportToCsv"
import {ChevronDownIcon, EditIcon, SettingsIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {FC, useMemo} from "react"

interface IProductListActions {
  selected?: string[]
  onBulkPromote: () => void
  onBulkEdit: () => void
}
// title={`${selected.length} selected product${selected.length === 1 ? "" : "s"}`}
const ProductListActions: FC<IProductListActions> = ({selected, onBulkPromote, onBulkEdit}) => {
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
        <BulkImport variant="menuitem" />
        <ExportToCsv variant="menuitem" />
        <MenuDivider />
        <MenuItem justifyContent="space-between" onClick={onBulkEdit} isDisabled={!hasBulkSelection}>
          Bulk Edit <EditIcon />
        </MenuItem>
        <MenuItem
          color="blue.500"
          justifyContent="space-between"
          onClick={onBulkPromote}
          isDisabled={!hasBulkSelection}
        >
          Promote Products <SettingsIcon />
        </MenuItem>
        {/* <MenuItem justifyContent="space-between" color="red.500" isDisabled={!hasBulkSelection}>
          Delete Products <DeleteIcon />
        </MenuItem> */}
      </MenuList>
    </Menu>
  )
}

export default ProductListActions

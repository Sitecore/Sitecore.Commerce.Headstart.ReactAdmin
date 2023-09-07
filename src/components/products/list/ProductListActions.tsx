import ProtectedContent from "@/components/auth/ProtectedContent"
import BulkImport from "@/components/demo/BulkImport"
import ExportToCsv from "@/components/demo/ExportToCsv"
import {ChevronDownIcon, EditIcon} from "@chakra-ui/icons"
import {Button, HStack, Menu, Icon, MenuButton, MenuDivider, MenuItem, MenuList, Text} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import {FC, useMemo} from "react"
import {TbSpeakerphone} from "react-icons/tb"

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
      <MenuButton as={Button} variant="outline" width={"max-content"}>
        <HStack>
          <Text>Actions</Text>
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        <ExportToCsv variant="menuitem" />
        <ProtectedContent hasAccess={appPermissions.ProductManager}>
          <>
            <BulkImport variant="menuitem" />
            <MenuDivider />
            <MenuItem justifyContent="space-between" onClick={onBulkEdit} isDisabled={!hasBulkSelection}>
              Bulk Edit <EditIcon />
            </MenuItem>
            <MenuItem justifyContent="space-between" onClick={onBulkPromote} isDisabled={!hasBulkSelection}>
              Promote <Icon as={TbSpeakerphone} transform={"rotate(-35deg)"} fontSize="1.15em" strokeWidth="1.7" />
            </MenuItem>
          </>
        </ProtectedContent>
      </MenuList>
    </Menu>
  )
}

export default ProductListActions

import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Menu, MenuButton, IconButton, Icon, MenuList, MenuDivider, MenuItem} from "@chakra-ui/react"
import {TbDotsVertical} from "react-icons/tb"
import {SpecFieldValues} from "types/form/SpecFieldValues"
import {SpecUpdateModal} from "./SpecUpdateModal"

interface SpecActionMenuProps {
  spec: SpecFieldValues
  onDelete: () => void
  onUpdate: (spec: SpecFieldValues) => void
}
export function SpecActionsMenu({spec, onDelete, onUpdate}: SpecActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`spec action menu for ${spec.Name}`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="blackAlpha.400" />
      </MenuButton>
      <MenuList>
        <SpecUpdateModal
          initialSpec={spec}
          onUpdate={onUpdate}
          as="menuitem"
          menuItemProps={{
            justifyContent: "space-between",
            children: (
              <>
                Edit <EditIcon />
              </>
            )
          }}
        />
        <MenuDivider />
        <MenuItem justifyContent="space-between" color="danger" onClick={onDelete}>
          Delete <DeleteIcon />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

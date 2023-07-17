import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {TbDotsVertical} from "react-icons/tb"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrder} from "types/ordercloud/IOrder"
import {IShipment} from "types/ordercloud/IShipment"
import {ShipmentModal} from "./shipment-modal/ShipmentModal"
import {useRef} from "react"

interface ShipmentActionMenuProps {
  shipment: IShipment
  order: IOrder
  lineItems: ILineItem[]
  onUpdate: () => void
  onDelete: () => void
}

export function ShipmentActionMenu({shipment, order, lineItems, onUpdate, onDelete}: ShipmentActionMenuProps) {
  const {isOpen: isDeleteDialogOpen, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog} = useDisclosure()
  const cancelRef = useRef()
  const handleCancelDeleteShipment = () => {
    onDelete()
    onCloseDeleteDialog()
  }
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<TbDotsVertical />}
          aria-label={`Shipment action menu for ${shipment.ID}`}
          variant="ghost"
        ></MenuButton>
        <MenuList>
          <ShipmentModal order={order} shipment={shipment} lineItems={lineItems} onUpdate={onUpdate} as="menuitem">
            <HStack width="full" justifyContent="space-between">
              <Text>Edit</Text> <EditIcon />
            </HStack>
          </ShipmentModal>
          <MenuDivider />
          <MenuItem justifyContent="space-between" color="red.500" onClick={onOpenDeleteDialog}>
            Delete <DeleteIcon />
          </MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog isOpen={isDeleteDialogOpen} leastDestructiveRef={cancelRef} onClose={onCloseDeleteDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Shipment</AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleCancelDeleteShipment} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

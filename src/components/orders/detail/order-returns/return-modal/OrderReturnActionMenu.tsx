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
import {useRef} from "react"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {ReturnModal} from "./ReturnModal"

interface ReturnActionMenuProps {
  orderReturn: IOrderReturn
  allOrderReturns: IOrderReturn[]
  order: IOrder
  lineItems: ILineItem[]
  onUpdate: () => void
  onDelete: () => void
}

export function ReturnActionMenu({
  orderReturn,
  allOrderReturns,
  order,
  lineItems,
  onUpdate,
  onDelete
}: ReturnActionMenuProps) {
  const {isOpen: isDeleteDialogOpen, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog} = useDisclosure()
  const cancelRef = useRef()
  const handleCancelDeleteReturn = () => {
    onDelete()
    onCloseDeleteDialog()
  }
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<TbDotsVertical />}
          aria-label={`Return action menu for ${orderReturn.ID}`}
          variant="ghost"
        ></MenuButton>
        <MenuList>
          <ReturnModal
            order={order}
            orderReturn={orderReturn}
            allOrderReturns={allOrderReturns}
            lineItems={lineItems}
            onUpdate={onUpdate}
            as="menuitem"
          >
            <HStack width="full" justifyContent="space-between">
              <Text>Edit</Text> <EditIcon />
            </HStack>
          </ReturnModal>
          <MenuDivider />
          <MenuItem justifyContent="space-between" color="red.500" onClick={onOpenDeleteDialog}>
            Delete <DeleteIcon />
          </MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog isOpen={isDeleteDialogOpen} leastDestructiveRef={cancelRef} onClose={onCloseDeleteDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Return</AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleCancelDeleteReturn} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

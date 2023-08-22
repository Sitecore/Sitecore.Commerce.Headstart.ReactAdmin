import {DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text
} from "@chakra-ui/react"
import Link from "next/link"
import {FC, useState} from "react"
import {TbDotsVertical} from "react-icons/tb"
import {BiTransfer} from "react-icons/bi"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import {AsyncSelect} from "chakra-react-select"
import {Buyers, Users} from "ordercloud-javascript-sdk"
import {useSuccessToast} from "hooks/useToast"

interface IBuyerUserActionMenu {
  buyerid: string
  buyeruser: IBuyerUser
  onOpen?: () => void
  onClose?: () => void
  onDelete: () => void
  onMove?: (buyerId: string) => void
}

const BuyerUserActionMenu: FC<IBuyerUserActionMenu> = ({buyerid, buyeruser, onOpen, onClose, onDelete, onMove}) => {
  const [loading, setLoading] = useState(false)
  const [selectedBuyerId, setSelectedBuyerId] = useState(null as string)
  const moveDisclosure = useDisclosure()
  const successToast = useSuccessToast()
  const loadBuyers = async (inputValue: string) => {
    const buyerList = await Buyers.List({search: inputValue})
    return buyerList.Items.filter((buyer) => buyer.ID !== buyerid) // exclude current buyer
      .map((buyer) => ({
        label: buyer.Name,
        value: buyer.ID
      }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await Users.Move(buyerid, buyeruser.ID, selectedBuyerId)
      moveDisclosure.onClose()
      onMove(selectedBuyerId)
      successToast({description: "User moved successfully"})
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Menu computePositionOnMount isLazy onOpen={onOpen} onClose={onClose} strategy="fixed">
        <MenuButton
          as={IconButton}
          aria-label={`Action menu for ${buyeruser.FirstName} ${buyeruser.LastName}`}
          variant="ghost"
        >
          <Icon as={TbDotsVertical} mt={1} />
        </MenuButton>
        <MenuList>
          <Link passHref href={`/buyers/${buyerid}/users/${buyeruser.ID}`}>
            <MenuItem as="a" justifyContent="space-between">
              Edit <EditIcon />
            </MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem as="a" justifyContent="space-between" onClick={moveDisclosure.onOpen}>
            Move <BiTransfer />
          </MenuItem>
          <MenuItem justifyContent="space-between" color="red.500" onClick={onDelete}>
            Delete <DeleteIcon />
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={moveDisclosure.isOpen} onClose={moveDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Move User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="gray.500" fontStyle="italic" marginBottom={6}>
              Move user to another buyer company
            </Text>
            <AsyncSelect
              placeholder="Select buyer"
              defaultOptions
              isMulti={false}
              colorScheme="accent"
              loadOptions={loadBuyers}
              onChange={(option) => setSelectedBuyerId(option.value)}
            />
          </ModalBody>
          <ModalFooter>
            <HStack width="full" justifyContent="space-between">
              <Button variant="ghost" onClick={moveDisclosure.onClose}>
                Cancel
              </Button>
              <Button colorScheme="primary" isDisabled={!selectedBuyerId} isLoading={loading} onClick={handleSubmit}>
                Move
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BuyerUserActionMenu

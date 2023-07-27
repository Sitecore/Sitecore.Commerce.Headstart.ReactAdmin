import {
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {Users} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"

interface IBuyerUserDeleteModal {
  buyerusers?: IBuyerUser[]
  disclosure: UseDisclosureProps
  buyerID: string
  onComplete: (idsToRemove: string[]) => void
}

const BuyerUserDeleteModal: FC<IBuyerUserDeleteModal> = ({buyerusers, disclosure, buyerID, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showbuyerusers, setShowbuyerusers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowbuyerusers(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(buyerusers.map((buyeruser) => Users.Delete(buyerID, buyeruser?.ID)))
      onComplete(buyerusers.map((usergroup) => usergroup.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [buyerusers, onComplete, onClose, buyerID])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {loading && (
          <Center
            rounded="md"
            position="absolute"
            left={0}
            w="full"
            h="full"
            bg="whiteAlpha.500"
            zIndex={2}
            color="teal"
          >
            <Spinner></Spinner>
          </Center>
        )}
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb={5}>
            <Heading size="sm" as="h5">
              {`Deleting ${buyerusers.length} Selected User Group${buyerusers.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowbuyerusers((s) => !s)}>
              {showbuyerusers ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showbuyerusers}>
            <List mb={5}>
              {buyerusers.map((usergroup, i) => (
                <>
                  <ListItem key={usergroup.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{usergroup.ID}</Badge>
                        <Text>
                          {usergroup.FirstName} {usergroup.LastName}
                        </Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < buyerusers.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right usergroup.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BuyerUserDeleteModal

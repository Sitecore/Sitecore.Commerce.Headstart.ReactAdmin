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
import {SupplierUsers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"

interface ISupplierUserDeleteModal {
  supplierusers?: ISupplierUser[]
  disclosure: UseDisclosureProps
  supplierID: string
  onComplete: (idsToRemove: string[]) => void
}

const SupplierUserDeleteModal: FC<ISupplierUserDeleteModal> = ({supplierusers, disclosure, supplierID, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showsupplierusers, setShowsupplierusers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowsupplierusers(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(supplierusers.map((supplieruser) => SupplierUsers.Delete(supplierID, supplieruser?.ID)))
      onComplete(supplierusers.map((user) => user.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [supplierusers, onComplete, onClose, supplierID])

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
              {`Deleting ${supplierusers.length} Selected User Group${supplierusers.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowsupplierusers((s) => !s)}>
              {showsupplierusers ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showsupplierusers}>
            <List mb={5}>
              {supplierusers.map((user, i) => (
                <>
                  <ListItem key={user.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{user.ID}</Badge>
                        <Text>
                          {user.FirstName} {user.LastName}
                        </Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < supplierusers.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right user.
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

export default SupplierUserDeleteModal

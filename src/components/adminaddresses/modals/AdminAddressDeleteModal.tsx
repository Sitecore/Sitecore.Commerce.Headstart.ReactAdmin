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
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {AdminAddresses} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"

interface IAdminAddressDeleteModal {
  adminAddresses?: IAdminAddress[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const AdminAddressDeleteModal: FC<IAdminAddressDeleteModal> = ({adminAddresses, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showAdminAddresses, setShowAdminAddresses] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowAdminAddresses(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(adminAddresses.map((adminAddress) => AdminAddresses.Delete(adminAddress?.ID)))
      onComplete(adminAddresses.map((adminAddress) => adminAddress.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [adminAddresses, onComplete, onClose])

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
              {`Deleting ${adminAddresses.length} Selected Admin Address${adminAddresses.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowAdminAddresses((s) => !s)}>
              {showAdminAddresses ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showAdminAddresses}>
            <List mb={5}>
              {adminAddresses.map((adminAddress, i) => (
                <>
                  <ListItem key={adminAddress.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{adminAddress.ID}</Badge>
                        <Text>{adminAddress.AddressName}</Text>
                        <Text fontSize="sm" noOfLines={1}>
                          {adminAddress.Street1} {adminAddress.Street2}
                        </Text>
                        <Text fontSize="sm" noOfLines={1}>
                          {adminAddress.City}, {adminAddress.State} {adminAddress.Zip}
                        </Text>
                        <Text fontSize="sm" noOfLines={1}>
                          {adminAddress.Country}
                        </Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < adminAddresses.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right admin
            address.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Admin Address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AdminAddressDeleteModal

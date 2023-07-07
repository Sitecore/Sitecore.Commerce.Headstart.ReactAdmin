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
import {SupplierAddresses} from "ordercloud-javascript-sdk"
import React from "react"
import {FC, useCallback, useEffect, useState} from "react"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"

interface ISupplierAddressDeleteModal {
  supplierID?: string
  supplierAddresses?: ISupplierAddress[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const SupplierAddressDeleteModal: FC<ISupplierAddressDeleteModal> = ({
  supplierID,
  supplierAddresses,
  disclosure,
  onComplete
}) => {
  const {isOpen, onClose} = disclosure
  const [showSupplierAddresses, setShowSupplierAddresses] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowSupplierAddresses(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(
        supplierAddresses.map((supplierAddress) => SupplierAddresses.Delete(supplierID, supplierAddress?.ID))
      )
      onComplete(supplierAddresses.map((supplierAddress) => supplierAddress.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [supplierID, supplierAddresses, onComplete, onClose])

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
              {`Deleting ${supplierAddresses.length} Selected Supplier Address${
                supplierAddresses.length === 1 ? "" : "s"
              }`}
            </Heading>
            <Button variant="link" onClick={() => setShowSupplierAddresses((s) => !s)}>
              {showSupplierAddresses ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showSupplierAddresses}>
            <List mb={5}>
              {supplierAddresses.map((supplierAddress, i) => (
                <React.Fragment key={supplierAddress.ID}>
                  <ListItem key={supplierAddress.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{supplierAddress.ID}</Badge>
                        <Text>{supplierAddress.AddressName}</Text>
                        <Text fontSize="sm" noOfLines={1}>
                          {supplierAddress.Street1} {supplierAddress.Street2}
                        </Text>
                        <Text fontSize="sm" noOfLines={1}>
                          {supplierAddress.City}, {supplierAddress.State} {supplierAddress.Zip}
                        </Text>
                        <Text fontSize="sm" noOfLines={1}>
                          {supplierAddress.Country}
                        </Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < supplierAddresses.length - 1 && <Divider my={3} />}
                </React.Fragment>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right supplier
            address.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Supplier Address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SupplierAddressDeleteModal

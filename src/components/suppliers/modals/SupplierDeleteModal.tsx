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
import {Suppliers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {ISupplier} from "types/ordercloud/ISupplier"

interface ISupplierDeleteModal {
  suppliers?: ISupplier[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const SupplierDeleteModal: FC<ISupplierDeleteModal> = ({suppliers, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showsuppliers, setShowsuppliers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowsuppliers(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(suppliers.map((supplier) => Suppliers.Delete(supplier?.ID)))
      onComplete(suppliers.map((supplier) => supplier.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [suppliers, onComplete, onClose])

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
              {`Deleting ${suppliers.length} Selected Supplier${suppliers.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowsuppliers((s) => !s)}>
              {showsuppliers ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showsuppliers}>
            <List mb={5}>
              {suppliers.map((supplier, i) => (
                <>
                  <ListItem key={supplier.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{supplier.ID}</Badge>
                        <Text>{supplier.Name}</Text>
                      </VStack>
                      <Tag colorScheme={supplier.Active ? "green" : "red"}>
                        {supplier.Active ? "Active" : "Inactive"}
                      </Tag>
                    </HStack>
                  </ListItem>
                  {i < suppliers.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right supplier.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Supplier
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SupplierDeleteModal

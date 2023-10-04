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
import {Catalogs, Users} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"

interface IBuyerCatalogDeleteModal {
  buyercatalogs?: ICatalog[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const BuyerCatalogDeleteModal: FC<IBuyerCatalogDeleteModal> = ({buyercatalogs, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showbuyercatalogs, setShowbuyercatalogs] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowbuyercatalogs(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(buyercatalogs.map((buyercatalog) => Catalogs.Delete(buyercatalog?.ID)))
      onComplete(buyercatalogs.map((buyercatalog) => buyercatalog.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [buyercatalogs, onComplete, onClose])

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
              {`Deleting ${buyercatalogs.length} Selected catalog${buyercatalogs.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowbuyercatalogs((s) => !s)}>
              {showbuyercatalogs ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showbuyercatalogs}>
            <List mb={5}>
              {buyercatalogs.map((buyercatalog, i) => (
                <>
                  <ListItem key={buyercatalog.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{buyercatalog.ID}</Badge>
                        <Text>{buyercatalog.Name}</Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < buyercatalogs.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right buyer
            catalog.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Catalog
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BuyerCatalogDeleteModal

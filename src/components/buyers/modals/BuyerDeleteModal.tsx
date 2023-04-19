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
import {Buyers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IBuyer} from "types/ordercloud/IBuyer"

interface IBuyerDeleteModal {
  buyers?: IBuyer[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const BuyerDeleteModal: FC<IBuyerDeleteModal> = ({buyers, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showbuyers, setShowbuyers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowbuyers(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(buyers.map((buyer) => Buyers.Delete(buyer?.ID)))
      onComplete(buyers.map((buyer) => buyer.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [buyers, onComplete, onClose])

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
              {`Deleting ${buyers.length} Selected Buyer${buyers.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowbuyers((s) => !s)}>
              {showbuyers ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showbuyers}>
            <List mb={5}>
              {buyers.map((buyer, i) => (
                <>
                  <ListItem key={buyer.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{buyer.ID}</Badge>
                        <Text>{buyer.Name}</Text>
                      </VStack>
                      <Tag colorScheme={buyer.Active ? "green" : "red"}>{buyer.Active ? "Active" : "Inactive"}</Tag>
                    </HStack>
                  </ListItem>
                  {i < buyers.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right buyer.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Buyer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BuyerDeleteModal

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
import {Promotions} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IPromotion} from "types/ordercloud/IPromotion"

interface IPromotionDeleteModal {
  promotions?: IPromotion[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const PromotionDeleteModal: FC<IPromotionDeleteModal> = ({promotions, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showPromotions, setShowPromotions] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowPromotions(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(promotions.map((promotion) => Promotions.Delete(promotion?.ID)))
      onComplete(promotions.map((promotion) => promotion.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [promotions, onComplete, onClose])

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
              {`Deleting ${promotions.length} Selected Promotion${promotions.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowPromotions((s) => !s)}>
              {showPromotions ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showPromotions}>
            <List mb={5}>
              {promotions.map((promotion, i) => (
                <>
                  <ListItem key={promotion.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{promotion.ID}</Badge>
                        <Text>{promotion.Name}</Text>
                      </VStack>
                      <Tag colorScheme={promotion.Active ? "green" : "red"}>
                        {promotion.Active ? "Active" : "Inactive"}
                      </Tag>
                    </HStack>
                  </ListItem>
                  {i < promotions.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right promotion.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            {`Delete Promotion${promotions.length === 1 ? "" : "s"}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PromotionDeleteModal

import {OrderStatus} from "@/components/orders/OrderStatus"
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
import {FC, useCallback, useEffect, useState} from "react"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {priceHelper} from "utils"

interface IOrderReturnDeleteModal {
  orderReturns?: IOrderReturn[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const OrderReturnDeleteModal: FC<IOrderReturnDeleteModal> = ({orderReturns, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showOrderReturns, setShowOrderReturns] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowOrderReturns(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      onComplete(orderReturns.map((or) => or.ID))
      onClose()
    }, 2000)
  }, [onComplete, orderReturns, onClose])

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
              {`Deleting ${orderReturns.length} Selected Order Return${orderReturns.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowOrderReturns((s) => !s)}>
              {showOrderReturns ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showOrderReturns}>
            <List mb={5}>
              {orderReturns.map((or, i) => (
                <>
                  <ListItem key={or.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{or.ID}</Badge>
                        <Text fontSize="sm">{`Refund Amount: ${priceHelper.formatPrice(or.RefundAmount)}`}</Text>
                      </VStack>
                      <OrderStatus status={or.Status} />
                    </HStack>
                  </ListItem>
                  {i < orderReturns.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right order
            returns.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            {`Delete Order Return${orderReturns.length === 1 ? "" : "s"}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default OrderReturnDeleteModal

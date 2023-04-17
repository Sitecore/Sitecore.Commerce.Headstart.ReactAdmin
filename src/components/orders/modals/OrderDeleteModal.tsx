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
import {FC, useCallback, useEffect, useState} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {priceHelper} from "utils"
import {OrderStatusColorSchemeMap} from "../list/OrderList"

interface IOrderDeleteModal {
  orderReturns?: IOrder[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const OrderDeleteModal: FC<IOrderDeleteModal> = ({orderReturns, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showOrders, setShowOrders] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowOrders(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      onComplete(orderReturns.map((o) => o.ID))
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
            <Button variant="link" onClick={() => setShowOrders((s) => !s)}>
              {showOrders ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showOrders}>
            <List mb={5}>
              {orderReturns.map((o, i) => (
                <>
                  <ListItem key={o.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{o.ID}</Badge>
                        <Text fontSize="sm">{`Order Total: ${priceHelper.formatPrice(o.Total)}`}</Text>
                      </VStack>
                      <Tag colorScheme={OrderStatusColorSchemeMap[o.Status] || "default"}>{o.Status}</Tag>
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

export default OrderDeleteModal

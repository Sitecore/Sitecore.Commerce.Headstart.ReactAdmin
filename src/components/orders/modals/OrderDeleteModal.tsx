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
import {FC, Fragment, useCallback, useEffect, useState} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {priceHelper} from "utils"
import {OrderStatusColorSchemeMap} from "../list/OrderList"

interface IOrderDeleteModal {
  orders?: IOrder[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const OrderDeleteModal: FC<IOrderDeleteModal> = ({orders, disclosure, onComplete}) => {
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
      onComplete(orders.map((o) => o.ID))
      onClose()
    }, 2000)
  }, [onComplete, orders, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {loading && (
          <Center rounded="md" position="absolute" left={0} w="full" h="full" bg="whiteAlpha.500" zIndex={2}>
            <Spinner></Spinner>
          </Center>
        )}
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb={5}>
            <Heading size="sm" as="h5">
              {`Deleting ${orders.length} Selected Orders${orders.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowOrders((s) => !s)}>
              {showOrders ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showOrders}>
            <List mb={5}>
              {orders.map((o, i) => (
                <Fragment key={i}>
                  <ListItem as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{o.ID}</Badge>
                        <Text fontSize="sm">{`Order Total: ${priceHelper.formatPrice(o.Total)}`}</Text>
                      </VStack>
                      <Tag colorScheme={OrderStatusColorSchemeMap[o.Status] || "default"}>{o.Status}</Tag>
                    </HStack>
                  </ListItem>
                  {i < orders.length - 1 && <Divider my={3} />}
                </Fragment>
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
            {`Delete Order Return${orders.length === 1 ? "" : "s"}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default OrderDeleteModal

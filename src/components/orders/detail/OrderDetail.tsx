import {
  Card,
  CardBody,
  Container,
  Stack,
  VStack,
  Text,
  CardHeader,
  Heading,
  Flex,
  HStack,
  Button
} from "@chakra-ui/react"
import {dateHelper} from "utils"
import {OrderSummary} from "./order-summary/OrderSummary"
import {OrderCustomer} from "./order-customer/OrderCustomer"
import {OrderPayments} from "./order-payments/OrderPayments"
import {useAuth} from "hooks/useAuth"
import {OrderLabel} from "./OrderLabel"
import {OrderProducts} from "./order-products/OrderProducts"
import {useOrderDetail} from "hooks/useOrderDetail"
import {OrderStatus} from "../OrderStatus"
import {ShipmentModal} from "./order-shipments/shipment-modal/ShipmentModal"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {Shipments} from "ordercloud-javascript-sdk"
import {OrderShipments} from "./order-shipments/OrderShipments"
import {OrderHeaderItem} from "./OrderHeaderItem"
import {OrderReturns} from "./order-returns/OrderReturns"
import {ReturnModal} from "./order-returns/return-modal/ReturnModal"
import {getMaxReturnQuantity} from "services/returns.service"

type OrderDetailProps = ReturnType<typeof useOrderDetail>

export function OrderDetail({
  order,
  lineItems,
  promotions,
  payments,
  suppliers,
  shipFromAddresses,
  shipments,
  returns,
  fetchOrder,
  fetchShipments,
  fetchLineItems,
  fetchReturns
}: OrderDetailProps) {
  const {isAdmin} = useAuth()
  const shippingAddress = lineItems?.length ? lineItems[0].ShippingAddress : null
  const orderDetailCardGap = 3

  const handleShipmentUpdate = async () => {
    await Promise.all([
      fetchShipments(order), // refresh shipments
      fetchOrder(order.ID), // refresh order in case status changed
      fetchLineItems(order) // refresh line items for QuantityShipped changes
    ])
  }

  const handleReturnUpdate = async () => {
    await fetchReturns(order)
  }

  const handleShipmentDelete = async (shipmentId) => {
    await Shipments.Delete(shipmentId)
    await handleShipmentUpdate()
  }

  const shippableLineItems = lineItems.filter((lineItem) => {
    if (!isAdmin) {
      // suppliers will only see their line items, and should be able to ship them all
      return true
    }
    // admins will see all line items, but should only be able to ship those they are fulfilling (not from other suppliers)
    return !lineItem.SupplierID
  })

  const refundableLineItems = lineItems.filter((lineItem) => {
    return lineItem.QuantityShipped && lineItem.Product.Returnable && getMaxReturnQuantity(lineItem, returns)
  })

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Heading size="md" marginBottom={7}>
        Order #{order.ID}
      </Heading>
      <VStack gap={orderDetailCardGap} width="full">
        <Card width="full">
          <CardBody maxWidth={{xl: "80%"}}>
            <Flex
              justifyContent="space-between"
              alignItems="start"
              flexWrap="wrap"
              marginBottom={order.Comments ? 5 : 0}
            >
              <OrderHeaderItem label="Placed on" value={dateHelper.formatDate(order.DateSubmitted)} />
              <OrderHeaderItem label="Order Status" value={<OrderStatus status={order.Status} />} />
              <OrderHeaderItem label="Last Modified" value={dateHelper.formatDate(order.LastUpdated)} />
            </Flex>
            {order.Comments && (
              <Stack
                direction={{base: "column", md: "row"}}
                maxWidth="sm"
                border="1px solid"
                borderColor="gray.200"
                padding="0.7rem"
              >
                <Text fontSize="small" fontWeight="bold">
                  Comments:
                </Text>
                <Text fontSize="small" color="gray.400" fontStyle="italic">
                  {order.Comments}
                </Text>
              </Stack>
            )}
          </CardBody>
        </Card>
        <Stack
          width="full"
          direction={["column", "column", "column", "column", "row"]}
          alignItems="start"
          gap={orderDetailCardGap}
        >
          <VStack width="full" flexGrow={1} gap={orderDetailCardGap}>
            <Card width="full">
              <CardHeader>
                <Stack direction={["column", "column", "row"]} justifyContent="space-between">
                  <Heading size="md">Products</Heading>
                  {order.Status === "Open" && shippableLineItems?.length && (
                    <ProtectedContent hasAccess={appPermissions.ShipmentManager}>
                      <ShipmentModal
                        order={order}
                        lineItems={shippableLineItems}
                        onUpdate={handleShipmentUpdate}
                        as="button"
                        buttonProps={{colorScheme: "primary", size: "sm"}}
                      >
                        Create shipment
                      </ShipmentModal>
                    </ProtectedContent>
                  )}
                </Stack>
              </CardHeader>
              <CardBody>
                <OrderProducts
                  isAdmin={isAdmin}
                  lineItems={lineItems}
                  suppliers={suppliers}
                  shipFromAddresses={shipFromAddresses}
                />
              </CardBody>
            </Card>
            {isAdmin && (
              <Card width="full">
                <CardHeader>
                  <Heading size="md">Payment</Heading>
                </CardHeader>
                <CardBody>
                  <OrderPayments
                    billingAddress={order.BillingAddress}
                    shippingAddress={shippingAddress}
                    payments={payments}
                  />
                </CardBody>
              </Card>
            )}
            {shipments?.length > 0 && (
              <Card width="full">
                <CardHeader>
                  <Heading size="md">Shipments</Heading>
                </CardHeader>
                <CardBody>
                  <OrderShipments
                    shipments={shipments}
                    lineItems={shippableLineItems}
                    order={order}
                    onUpdate={handleShipmentUpdate}
                    onDelete={handleShipmentDelete}
                  />
                </CardBody>
              </Card>
            )}
            <Card width="full">
              <CardHeader>
                <Stack direction={["column", "column", "row"]} justifyContent="space-between">
                  <Heading size="md">Returns</Heading>
                  {(order.Status === "Open" || order.Status === "Completed") && refundableLineItems?.length && (
                    <ReturnModal
                      order={order}
                      lineItems={refundableLineItems}
                      allOrderReturns={returns}
                      onUpdate={handleReturnUpdate}
                      as="button"
                      buttonProps={{colorScheme: "primary", size: "sm"}}
                    >
                      Create return
                    </ReturnModal>
                  )}
                </Stack>
              </CardHeader>
              <CardBody>
                <OrderReturns returns={returns} />
              </CardBody>
            </Card>
          </VStack>
          <VStack width="full" maxWidth={{xl: "350px"}} flexGrow={1} gap={orderDetailCardGap}>
            {isAdmin && (
              <Card width="full">
                <CardHeader>
                  <Heading size="md">Customer</Heading>
                </CardHeader>
                <CardBody>
                  <OrderCustomer order={order} shippingAddress={shippingAddress} />
                </CardBody>
              </Card>
            )}
            <Card width="full">
              <CardHeader>
                <Heading size="md">Order Total</Heading>
              </CardHeader>
              <CardBody>
                <OrderSummary order={order} promotions={promotions} />
              </CardBody>
            </Card>
          </VStack>
        </Stack>
      </VStack>
    </Container>
  )
}

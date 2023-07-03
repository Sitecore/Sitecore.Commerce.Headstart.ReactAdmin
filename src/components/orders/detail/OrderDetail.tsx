import {Card, CardBody, Container, Stack, VStack, Text, CardHeader, Heading, Button, Flex} from "@chakra-ui/react"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrder} from "types/ordercloud/IOrder"
import {dateHelper} from "utils"
import {OrderSummary} from "./order-summary/OrderSummary"
import {OrderCustomer} from "./order-customer/OrderCustomer"
import {IOrderPromotion} from "types/ordercloud/IOrderPromotion"
import {IPayment} from "types/ordercloud/IPayment"
import {OrderPayments} from "./order-payments/OrderPayments"
import {IBuyerAddress} from "types/ordercloud/IBuyerAddress"
import {useAuth} from "hooks/useAuth"
import {OrderLabel} from "./OrderLabel"
import {OrderProducts} from "./order-products/OrderProducts"
import {ISupplier} from "types/ordercloud/ISupplier"
import {ShipFromAddressMap} from "hooks/useOrderDetail"
import {OrderStatus} from "../OrderStatus"

interface OrderDetailProps {
  order: IOrder
  lineItems: ILineItem[]
  promotions: IOrderPromotion[]
  payments: IPayment[]
  billingAddress: IBuyerAddress
  suppliers: ISupplier[]
  shipFromAddresses: ShipFromAddressMap
}

export function OrderDetail({
  order,
  lineItems,
  promotions,
  payments,
  billingAddress,
  suppliers,
  shipFromAddresses
}: OrderDetailProps) {
  const {isAdmin} = useAuth()
  const shippingAddress = lineItems?.length ? lineItems[0].ShippingAddress : null
  const orderDetailCardGap = 3
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
                  {order.Status === "Open" && (
                    <Button colorScheme="primary" size="sm">
                      Create shipment
                    </Button>
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
                    billingAddress={billingAddress}
                    shippingAddress={shippingAddress}
                    payments={payments}
                  />
                </CardBody>
              </Card>
            )}
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

function OrderHeaderItem({label, value}) {
  return (
    <VStack alignItems="start" minWidth="250px" marginBottom={3}>
      <OrderLabel>{label}</OrderLabel>
      <Text>{value}</Text>
    </VStack>
  )
}

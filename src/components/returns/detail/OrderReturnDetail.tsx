import {OrderStatus} from "@/components/orders/OrderStatus"
import {ReturnItemsTable} from "./ReturnItemsTable"
import {HeaderItem} from "@/components/shared/HeaderItem"
import {
  Container,
  Heading,
  VStack,
  Card,
  CardBody,
  Stack,
  Text,
  CardHeader,
  Box,
  HStack,
  Button
} from "@chakra-ui/react"
import {useOrderReturnDetail} from "hooks/useOrderReturnDetail"
import {dateHelper, priceHelper} from "utils"
import {Link} from "@chakra-ui/next-js"
import {Payment, Payments} from "ordercloud-javascript-sdk"
import {useState} from "react"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

type OrderReturnDetailProps = ReturnType<typeof useOrderReturnDetail>

export function OrderReturnDetail({orderReturn, lineItems, payment, fetchOrderReturn}: OrderReturnDetailProps) {
  const [loading, setLoading] = useState(false)
  const cardGap = 3

  const handleCompleteReturn = async () => {
    try {
      setLoading(true)
      let orderReturnPayment: Payment
      if (payment) {
        // we must create a payment with a negative amount equal to OrderReturn.RefundAmount in order for the order
        // return to complete automatically
        orderReturnPayment = {
          ...payment,
          OrderReturnID: orderReturn.ID,
          Amount: orderReturn.RefundAmount * -1
        }
      } else {
        // in ordercloud it is possible to submit an order without payment, so we must account for this
        orderReturnPayment = {
          Type: null,
          OrderReturnID: orderReturn.ID,
          Amount: orderReturn.RefundAmount * -1,
          Accepted: true
        }
      }
      await Payments.Create("All", orderReturn.OrderID, orderReturnPayment)
      await fetchOrderReturn(orderReturn.ID) // get updated status
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Heading size="md" marginBottom={7}>
        <HStack justifyContent="space-between">
          <Text>Return #{orderReturn.ID}</Text>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            {orderReturn.Status === "Open" && (
              <Button variant="solid" colorScheme="primary" onClick={handleCompleteReturn} isLoading={loading}>
                Complete
              </Button>
            )}
          </ProtectedContent>
        </HStack>
      </Heading>
      <VStack gap={cardGap} width="full">
        <Card width="full">
          <CardBody maxWidth={{xl: "container.xl"}}>
            <VStack width="full" gap={5} marginBottom={orderReturn.Comments ? 5 : 0}>
              <Stack
                width="full"
                gap={5}
                direction={["column", "column", "row"]}
                justifyContent="space-between"
                alignItems="start"
              >
                <HeaderItem label="Placed on" value={dateHelper.formatDate(orderReturn.DateSubmitted)} />
                <HeaderItem label="Order Status" value={<OrderStatus status={orderReturn.Status} />} />
                <HeaderItem label="Last Modified" value={dateHelper.formatDate(orderReturn.LastUpdated)} />
              </Stack>
              <Stack
                width="full"
                gap={5}
                direction={["column", "column", "row"]}
                justifyContent="space-between"
                alignItems="start"
              >
                <HeaderItem label="Refund Amount" value={priceHelper.formatPrice(orderReturn.RefundAmount)} />
                <HeaderItem
                  label="Order ID"
                  value={<Link href={`/orders/${orderReturn.OrderID}`}>{orderReturn.OrderID}</Link>}
                />
                <Box />
              </Stack>
            </VStack>
            {orderReturn.Comments && (
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
                  {orderReturn.Comments}
                </Text>
              </Stack>
            )}
          </CardBody>
        </Card>
        <Card width="full">
          <CardHeader>
            <Heading size="md">Items</Heading>
          </CardHeader>
          <CardBody>
            <ReturnItemsTable itemsToReturn={orderReturn.ItemsToReturn} lineItems={lineItems} />
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

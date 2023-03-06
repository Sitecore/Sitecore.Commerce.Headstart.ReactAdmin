import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer
} from "@chakra-ui/react"
import {FunctionComponent, useEffect, useState} from "react"
import {OrderReturn, OrderReturns, Payment, Payments} from "ordercloud-javascript-sdk"
import {dateHelper, priceHelper} from "lib/utils"
import Card from "lib/components/card/Card"
import {NextSeo} from "next-seo"
import OcOrderReturnItemList from "lib/components/returns/OcOrderReturnItem"
import {useRouter} from "next/router"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Return Details",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const OrderReturnDetailPage: FunctionComponent = () => {
  const router = useRouter()
  const [orderReturn, setOrderReturn] = useState({} as OrderReturn)
  const [itemsToReturn, setItemsToReturn] = useState([])

  useEffect(() => {
    const getOrderReturn = async () => {
      const orderReturnId = router.query.returnid as string
      if (!orderReturnId) {
        return
      }
      const ocOrderReturn = await OrderReturns.Get(orderReturnId)
      setOrderReturn(ocOrderReturn)
      setItemsToReturn(ocOrderReturn.ItemsToReturn)
    }

    getOrderReturn()
  }, [router.query.returnid])

  const getStatusColor = (): string => {
    switch (orderReturn.Status) {
      case "Completed":
        return "green"
      case "Declined":
        return "red"
      case "Canceled":
        return "red"
      default:
        return "blue"
    }
  }

  const handleCompleteAnOrderReturn = async () => {
    const orderReturnPaymentRequest: Payment = {
      Type: null,
      Description: "Return Payment",
      Amount: -Math.abs(orderReturn.RefundAmount), // Return payment amount must be negative
      Accepted: true,
      OrderReturnID: orderReturn.ID
    }
    await Payments.Create("All", orderReturn.OrderID, orderReturnPaymentRequest)
    const updatedOrderReturn = await OrderReturns.Get(orderReturn.ID)
    setOrderReturn(updatedOrderReturn)
  }

  const handleCancelAnOrderReturn = async () => {
    const canceledOrderReturn = await OrderReturns.Cancel(orderReturn.ID)
    setOrderReturn(canceledOrderReturn)
  }

  if (!orderReturn.ID) {
    return (
      <>
        <NextSeo title="Order Return Detail" />
        Loading...
      </>
    )
  }
  return (
    <>
      <Container maxW="full" marginTop={30} marginBottom={30}>
        <NextSeo title="Order Return Detail" />
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <HStack>
            <Button variant="secondaryButton">Print Shipping Label</Button>
            <Button variant="secondaryButton">Export PDF</Button>
            <Button variant="secondaryButton">Export CSV</Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <Box>
            <Badge variant="outline" color={getStatusColor()}>
              {/* Space before capital letters */}
              {orderReturn.Status.replace(/[A-Z]/g, " $&").trim()}
            </Badge>
            <Divider m="3" />
            <Flex minWidth="max-content" alignItems="center" gap="2" mb="4">
              <Box>
                <Heading size="md">Refund Amount: {priceHelper.formatPrice(orderReturn.RefundAmount)}</Heading>
              </Box>
              <Spacer />
              <ButtonGroup gap="2">
                {orderReturn.Status === "Open" && (
                  <>
                    <Button variant="primaryButton" onClick={handleCompleteAnOrderReturn}>
                      Complete
                    </Button>
                    <Button variant="secondaryButton" onClick={handleCancelAnOrderReturn}>
                      Cancel
                    </Button>
                  </>
                )}
              </ButtonGroup>
            </Flex>

            <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
              <GridItem w="100%" h="10">
                <Heading as="h5" size="sm">
                  Order ID
                </Heading>
                {orderReturn.OrderID}
              </GridItem>
              <GridItem w="100%" h="10">
                <Heading as="h5" size="sm">
                  Request Submitted
                </Heading>
                {dateHelper.formatDate(orderReturn.DateSubmitted)}
              </GridItem>
              {orderReturn.DateCanceled && (
                <GridItem w="100%" h="10">
                  <Heading as="h5" size="sm">
                    Date Canceled
                  </Heading>
                  {dateHelper.formatDate(orderReturn.DateCanceled)}
                </GridItem>
              )}
              {orderReturn.DateCompleted && (
                <GridItem w="100%" h="10">
                  <Heading as="h5" size="sm">
                    Date Completed
                  </Heading>
                  {dateHelper.formatDate(orderReturn.DateCompleted)}
                </GridItem>
              )}
              {orderReturn.Comments && (
                <GridItem w="100%" h="10">
                  <Heading as="h5" size="sm">
                    Comments
                  </Heading>
                  {orderReturn.Comments}
                </GridItem>
              )}
            </Grid>
          </Box>
          <Box mt="6">
            <Heading as="h3" size="lg">
              Return Items
            </Heading>
            <Divider m="3" />
            <OcOrderReturnItemList itemsToReturn={itemsToReturn} />
          </Box>
        </Card>
      </Container>
    </>
  )
}

const ProtectedOrderReturnDetailPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <OrderReturnDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedOrderReturnDetailPage

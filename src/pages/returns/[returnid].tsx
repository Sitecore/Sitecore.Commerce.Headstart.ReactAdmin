import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer,
  Skeleton,
  VStack
} from "@chakra-ui/react"
import {FunctionComponent, useEffect, useState} from "react"
import {OrderReturn, OrderReturns, Payment, Payments} from "ordercloud-javascript-sdk"
import {dateHelper, priceHelper} from "utils"
import ExportToCsv from "components/demo/ExportToCsv"
import ExportToPdf from "components/demo/ExportToPdf"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {IPayment} from "types/ordercloud/IPayment"
import {NextSeo} from "next-seo"
import OcOrderReturnItemList from "components/returns/OcOrderReturnItem"
import PrintShippingLabel from "components/demo/PrintShippingLabel"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"

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
      const ocOrderReturn = await OrderReturns.Get<IOrderReturn>(orderReturnId)
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
    await Payments.Create<IPayment>("All", orderReturn.OrderID, orderReturnPaymentRequest)
    const updatedOrderReturn = await OrderReturns.Get<IOrderReturn>(orderReturn.ID)
    setOrderReturn(updatedOrderReturn)
  }

  const handleCancelAnOrderReturn = async () => {
    const canceledOrderReturn = await OrderReturns.Cancel(orderReturn.ID)
    setOrderReturn(canceledOrderReturn)
  }

  if (!orderReturn.ID) {
    return (
      <Flex flexGrow="1" id="skeleton-loader--return">
        <NextSeo title="Order Return Detail" />
        <Container
          display="flex"
          flexFlow="column nowrap"
          maxW="100%"
          bgColor="st.mainBackgroundColor"
          flexGrow={1}
          p={[4, 6, 8]}
        >
          <HStack mb={6}>
            <Skeleton borderRadius="md" w="100%" h="40px" />
          </HStack>
          <Skeleton borderRadius="md" w="100%" h={"70%"} />
        </Container>
      </Flex>
    )
  }
  return (
    <>
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <NextSeo title="Order Return Detail" />
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <HStack>
            <PrintShippingLabel />
            <ExportToCsv />
            <ExportToPdf />
          </HStack>
        </HStack>
        <Card p={6}>
          <Box>
            <Badge fontSize="lg" colorScheme={getStatusColor()}>
              {/* Space before capital letters */}
              {orderReturn.Status.replace(/[A-Z]/g, " $&").trim()}
            </Badge>
            <Divider my={6} />
            <Flex minWidth="max-content" alignItems="center" gap="2" mb="4">
              <Box>
                <Heading size="md">Refund Amount: {priceHelper.formatPrice(orderReturn.RefundAmount)}</Heading>
              </Box>
              <Spacer />
              <ButtonGroup gap="2">
                {orderReturn.Status === "Open" && (
                  <>
                    <Button variant="solid" colorScheme="primary" onClick={handleCompleteAnOrderReturn}>
                      Complete
                    </Button>
                    <Button variant="outline" onClick={handleCancelAnOrderReturn}>
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
          <Box mt={10}>
            <Heading as="h3" size="md">
              Return Items
            </Heading>
            <Divider my={6} />
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

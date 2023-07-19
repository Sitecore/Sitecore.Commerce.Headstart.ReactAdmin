import {HStack, VStack, Text, Stack} from "@chakra-ui/react"
import {IPayment} from "types/ordercloud/IPayment"
import {IBuyerAddress} from "types/ordercloud/IBuyerAddress"
import {SingleLineAddress} from "../SingleLineAddress"
import {OrderLabel} from "../OrderLabel"
import {OrderPayment} from "./OrderPayment"

const paymentTypeMap = {
  CreditCard: "Credit Card",
  PurchaseOrder: "Purchase Order",
  SpendingAccount: "Spending Account"
}

interface OrderPaymentsProps {
  payments: IPayment[]
  billingAddress: IBuyerAddress
  shippingAddress: IBuyerAddress
}
export function OrderPayments({payments, billingAddress, shippingAddress}: OrderPaymentsProps) {
  if (!payments?.length) {
    return <Text color="gray.400">No payment on order</Text>
  }

  const hasSameShippingAndBillingAddress = () => {
    if (!shippingAddress || !billingAddress) {
      return false
    }

    if (shippingAddress.ID === billingAddress.ID) {
      return true
    }

    // if they aren't using saved addresses then we must compare address fields
    return (
      shippingAddress.Street1 === billingAddress.Street1 &&
      shippingAddress.Street2 === billingAddress.Street2 &&
      shippingAddress.City === billingAddress.City &&
      shippingAddress.State === billingAddress.State &&
      shippingAddress.Zip === billingAddress.Zip &&
      shippingAddress.Country === billingAddress.Country
    )
  }

  const isSameBillingAsShipping = !hasSameShippingAndBillingAddress()

  return (
    <>
      {payments.map((payment) => {
        return (
          <Stack
            key={payment.ID}
            direction={["column", "column", "row"]}
            gap={[5, 5, 0]}
            justifyContent="space-between"
            maxWidth={{xl: "80%"}}
          >
            <VStack alignItems="start">
              <OrderLabel>{paymentTypeMap[payment.Type]}</OrderLabel>
              <OrderPayment payment={payment} />
            </VStack>
            <VStack alignItems="start">
              <OrderLabel>Billing Address</OrderLabel>
              {billingAddress ? (
                isSameBillingAsShipping ? (
                  <SingleLineAddress address={billingAddress} />
                ) : (
                  <Text>Same as shipping address</Text>
                )
              ) : (
                <Text>No billing address</Text>
              )}
            </VStack>
          </Stack>
        )
      })}
    </>
  )
}

import {VStack, Text, Stack} from "@chakra-ui/react"
import {IPayment} from "types/ordercloud/IPayment"
import {IBuyerAddress} from "types/ordercloud/IBuyerAddress"
import {SingleLineAddress} from "../SingleLineAddress"
import {OrderPayment} from "./OrderPayment"
import {TextLabel} from "@/components/shared/TextLabel"

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
            maxWidth={{xl: "container.xl"}}
          >
            <VStack alignItems="start">
              <TextLabel>{paymentTypeMap[payment.Type]}</TextLabel>
              <OrderPayment payment={payment} />
            </VStack>
            <VStack alignItems="start">
              <TextLabel>Billing Address</TextLabel>
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

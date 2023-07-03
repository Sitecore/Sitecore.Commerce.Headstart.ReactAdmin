import {HStack, Text} from "@chakra-ui/react"
import {ICreditCard} from "types/ordercloud/ICreditCard"
import {IPayment} from "types/ordercloud/IPayment"
import {priceHelper} from "utils"
import {CreditCardIcon} from "./CreditCardIcon"

interface OrderPaymentItemProps {
  payment: IPayment
}
export function OrderPayment({payment}: OrderPaymentItemProps) {
  const displayCardType = (cardType: ICreditCard["CardType"]) => {
    if (cardType === "AmericanExpress") {
      return "American Express"
    }
    return cardType
  }
  if (payment.Type === "CreditCard" && payment.CreditCard) {
    return (
      <HStack>
        <CreditCardIcon fontSize="3xl" cardType={payment?.CreditCard?.CardType} />
        <Text>
          {displayCardType(payment.CreditCard?.CardType)} ending in {payment.CreditCard?.PartialAccountNumber}
        </Text>
        <Text fontWeight="bold">-{priceHelper.formatPrice(payment.Amount)}</Text>
      </HStack>
    )
  } else if (payment.Type === "SpendingAccount" && payment.SpendingAccount) {
    return (
      <HStack>
        <Text>{payment.SpendingAccount?.Name}</Text>
        <Text fontWeight="bold">-{priceHelper.formatPrice(payment.Amount)}</Text>
      </HStack>
    )
  } else {
    return (
      <HStack>
        <Text>{payment.Type}</Text>
        <Text fontWeight="bold">-{priceHelper.formatPrice(payment.Amount)}</Text>
      </HStack>
    )
  }
}

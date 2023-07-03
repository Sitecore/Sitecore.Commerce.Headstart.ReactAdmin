import {IOrder} from "types/ordercloud/IOrder"
import {Divider, Text} from "@chakra-ui/react"
import {SingleLineAddress} from "../SingleLineAddress"
import {IBuyerAddress} from "types/ordercloud/IBuyerAddress"

interface OrderCustomerProps {
  order: IOrder
  shippingAddress: IBuyerAddress
}
export function OrderCustomer({order, shippingAddress}: OrderCustomerProps) {
  return (
    <>
      <Text fontWeight="bold">
        {order.FromUser.FirstName} {order.FromUser.LastName}
      </Text>
      <Text fontSize="sm" color="gray.400">
        {order.FromUser.Email}
      </Text>
      {order.FromUser.Phone && (
        <Text fontSize="sm" color="gray.400">
          {order.FromUser.Phone}
        </Text>
      )}
      {shippingAddress && (
        <>
          <Divider my="4" />
          <Text fontWeight="bold">Shipping address</Text>
          <SingleLineAddress address={shippingAddress} />
        </>
      )}
    </>
  )
}

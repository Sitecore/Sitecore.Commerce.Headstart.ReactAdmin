import {Tag, TagProps} from "@chakra-ui/react"

const OrderStatusColorSchemeMap = {
  "": "gray",
  Unsubmitted: "info",
  Open: "info",
  AwaitingApproval: "warning",
  Canceled: "danger",
  Declined: "danger",
  Completed: "success"
}
interface OrderStatusProps extends TagProps {
  status?: string
}
export function OrderStatus({status, ...tagProps}: OrderStatusProps) {
  return (
    <Tag colorScheme={OrderStatusColorSchemeMap[status] || "default"} {...tagProps}>
      {status}
    </Tag>
  )
}

import {TextProps, HStack, Text} from "@chakra-ui/react"
import {OrderLabel} from "../OrderLabel"

interface OrderSummaryItemProps {
  label: string
  value: string
  labelProps?: TextProps
  valueProps?: TextProps
}
export function OrderSummaryItem({label, value, labelProps, valueProps}: OrderSummaryItemProps) {
  return (
    <HStack justifyContent="space-between">
      <OrderLabel {...labelProps}>{label}</OrderLabel>
      <Text {...valueProps}>{value}</Text>
    </HStack>
  )
}

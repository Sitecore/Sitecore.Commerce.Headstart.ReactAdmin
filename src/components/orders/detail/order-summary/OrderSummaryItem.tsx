import {TextProps, HStack, Text} from "@chakra-ui/react"
import {ReactNode} from "react"
import {TextLabel} from "@/components/shared/TextLabel"

interface OrderSummaryItemProps {
  label: ReactNode
  value: ReactNode
  labelProps?: TextProps
  valueProps?: TextProps
}
export function OrderSummaryItem({label, value, labelProps, valueProps}: OrderSummaryItemProps) {
  return (
    <HStack justifyContent="space-between">
      <TextLabel {...labelProps}>{label}</TextLabel>
      <Text {...valueProps}>{value}</Text>
    </HStack>
  )
}

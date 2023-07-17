import {VStack, Text, StackProps, Stack} from "@chakra-ui/react"
import {OrderLabel} from "./OrderLabel"
import {ReactNode} from "react"

interface OrderHeaderItemProps extends StackProps {
  label: ReactNode
  value: ReactNode
}
export function OrderHeaderItem({label, value, ...containerProps}: OrderHeaderItemProps) {
  return (
    <Stack direction="column" alignItems="start" {...containerProps}>
      <OrderLabel>{label}</OrderLabel>
      {typeof value === "string" ? <Text>{value}</Text> : value}
    </Stack>
  )
}

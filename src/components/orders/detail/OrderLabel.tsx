import {Text, TextProps} from "@chakra-ui/react"
import {ReactNode} from "react"

interface OrderLabelProps extends TextProps {
  children: ReactNode
}
export function OrderLabel({children, ...textProps}: OrderLabelProps) {
  return (
    <Text fontSize="xs" fontWeight="medium" color="gray.400" textTransform="uppercase" {...textProps}>
      {children}
    </Text>
  )
}

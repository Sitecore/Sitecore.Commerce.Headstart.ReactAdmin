import {Text, TextProps} from "@chakra-ui/react"
import {ReactNode} from "react"

interface TextLabelProps extends TextProps {
  children: ReactNode
}
export function TextLabel({children, ...textProps}: TextLabelProps) {
  return (
    <Text fontSize="xs" fontWeight="medium" color="gray.400" textTransform="uppercase" {...textProps}>
      {children}
    </Text>
  )
}

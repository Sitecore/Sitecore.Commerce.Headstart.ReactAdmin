import {Text, StackProps, Stack} from "@chakra-ui/react"
import {ReactNode} from "react"
import {TextLabel} from "@/components/shared/TextLabel"

interface HeaderItemProps extends StackProps {
  label: ReactNode
  value: ReactNode
}
export function HeaderItem({label, value, ...stackProps}: HeaderItemProps) {
  return (
    <Stack direction="column" alignItems="start" {...stackProps}>
      <TextLabel>{label}</TextLabel>
      {typeof value === "string" ? <Text>{value}</Text> : value}
    </Stack>
  )
}

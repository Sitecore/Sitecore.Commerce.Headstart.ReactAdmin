import {add, compact} from "lodash"
import {Text, TextProps} from "@chakra-ui/react"
import {Address} from "ordercloud-javascript-sdk"

interface SingleLineAddressProps extends TextProps {
  address?: Address
}
export function SingleLineAddress({address, ...textProps}: SingleLineAddressProps) {
  if (!address) return null
  const addressParts1 = compact([address.Street1, address.Street2, address.City])
  const addressParts2 = [address.State, address.Zip]

  const addressString = `${addressParts1.join(" ")}, ${addressParts2.join(" ")}`
  return (
    <Text wordBreak="break-word" {...textProps}>
      {addressString}
    </Text>
  )
}

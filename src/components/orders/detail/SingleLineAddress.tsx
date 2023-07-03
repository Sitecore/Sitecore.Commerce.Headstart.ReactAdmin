import {add, compact} from "lodash"
import {Text} from "@chakra-ui/react"
import {Address} from "ordercloud-javascript-sdk"

interface SingleLineAddressProps {
  address?: Address
}
export function SingleLineAddress({address}: SingleLineAddressProps) {
  if (!address) return null
  const addressParts1 = compact([address.Street1, address.Street2, address.City])
  const addressParts2 = [address.State, address.Zip]

  const addressString = `${addressParts1.join(" ")}, ${addressParts2.join(" ")}`
  return <Text wordBreak="break-word">{addressString}</Text>
}

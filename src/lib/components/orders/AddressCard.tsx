import {Address} from "ordercloud-javascript-sdk"
import {Text, TextProps} from "@chakra-ui/react"

export interface AddressCardProps {
  address: Address
  fontSize?: TextProps["size"]
}
const AddressCard = ({address, fontSize = "sm"}: AddressCardProps) => {
  if (!address) {
    return (
      <div>
        <Text fontSize={fontSize}>John Smith</Text>
        <Text fontSize={fontSize}>123 Sunrise Pointe</Text>
        <Text fontSize={fontSize}>Pleasant Hill, MN 55604</Text>
      </div>
    )
  }
  return (
    <div>
      <Text fontSize={fontSize}>{address.CompanyName || address.FirstName + " " + address.LastName}</Text>
      <Text fontSize={fontSize}>{address.Street1}</Text>
      {address.Street2 && <Text fontSize={fontSize}>{address.Street2}</Text>}
      <Text fontSize={fontSize}>
        {address.City}, {address.State} {address.Zip}
      </Text>
    </div>
  )
}

export default AddressCard

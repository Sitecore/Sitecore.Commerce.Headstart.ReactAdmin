import {Checkbox, Flex, Heading, Spacer, Text, Tooltip, VStack} from "@chakra-ui/react"
import {Address} from "ordercloud-javascript-sdk"
import Link from "next/link"

interface SupplierAddressCardProps {
  supplierAddress: Address
  selected: boolean
  onSupplierAddressSelected: (supplierAddressId: string, selected: boolean) => void
  renderSupplierAddressActions?: (supplierAddress: Address) => React.ReactElement | React.ReactElement[] | string
}
const SupplierAddressCard = (props: SupplierAddressCardProps) => {
  const {supplierAddress, renderSupplierAddressActions} = props

  return (
    <VStack
      h="full"
      justifyContent="space-between"
      p={4}
      backgroundColor="Background"
      border="1px solid"
      borderColor="blackAlpha.200"
      borderRadius="lg"
      shadow="md"
    >
      <Flex w="full" alignItems={"flex-start"}>
        <Checkbox
          isChecked={props.selected}
          onChange={(e) => props.onSupplierAddressSelected(supplierAddress.ID, e.target.checked)}
        />
        <Spacer />
        {renderSupplierAddressActions && renderSupplierAddressActions(supplierAddress)}
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" w="full">
        <Link passHref style={{cursor: "pointer"}} href={"/settings/supplieraddresses/" + supplierAddress.ID}>
          <Heading as="a" fontSize="lg">
            <Tooltip label={supplierAddress.AddressName} placement="top">
              <Text as="span" noOfLines={1}>
                {supplierAddress.AddressName}
              </Text>
            </Tooltip>
          </Heading>
        </Link>
        <Text fontSize="sm" noOfLines={1}>
          {supplierAddress.Street1} {supplierAddress.Street2}
        </Text>
        <Text fontSize="sm" noOfLines={1}>
          {supplierAddress.City}, {supplierAddress.State} {supplierAddress.Zip}
        </Text>
        <Text fontSize="sm" noOfLines={1}>
          {supplierAddress.Country}
        </Text>
      </VStack>
    </VStack>
  )
}

export default SupplierAddressCard

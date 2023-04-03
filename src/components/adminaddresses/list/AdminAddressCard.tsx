import {Checkbox, Flex, Heading, Spacer, Text, Tooltip, VStack} from "@chakra-ui/react"
import {Address} from "ordercloud-javascript-sdk"
import Link from "next/link"

interface AdminAddressCardProps {
  adminAddress: Address
  selected: boolean
  onAdminAddressSelected: (adminAddressId: string, selected: boolean) => void
  renderAdminAddressActions?: (adminAddress: Address) => React.ReactElement | React.ReactElement[] | string
}
const AdminAddressCard = (props: AdminAddressCardProps) => {
  const {adminAddress, renderAdminAddressActions} = props

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
          onChange={(e) => props.onAdminAddressSelected(adminAddress.ID, e.target.checked)}
        />
        <Spacer />
        {renderAdminAddressActions && renderAdminAddressActions(adminAddress)}
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" w="full">
        <Link passHref style={{cursor: "pointer"}} href={"/settings/adminaddresses/" + adminAddress.ID}>
          <Heading as="a" fontSize="lg">
            <Tooltip label={adminAddress.AddressName} placement="top">
              <Text as="span" noOfLines={1}>
                {adminAddress.AddressName}
              </Text>
            </Tooltip>
          </Heading>
        </Link>
        <Text fontSize="sm" noOfLines={1}>
          {adminAddress.Street1} {adminAddress.Street2}
        </Text>
        <Text fontSize="sm" noOfLines={1}>
          {adminAddress.City}, {adminAddress.State} {adminAddress.Zip}
        </Text>
        <Text fontSize="sm" noOfLines={1}>
          {adminAddress.Country}
        </Text>
      </VStack>
    </VStack>
  )
}

export default AdminAddressCard

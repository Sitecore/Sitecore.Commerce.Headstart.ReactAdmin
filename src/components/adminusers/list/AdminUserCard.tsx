import {Badge, Checkbox, Flex, Heading, Spacer, Text, Tooltip, VStack} from "@chakra-ui/react"
import {User} from "ordercloud-javascript-sdk"
import Link from "next/link"

interface AdminUserCardProps {
  adminUser: User
  selected: boolean
  onAdminUserSelected: (adminUserId: string, selected: boolean) => void
  renderAdminUserActions?: (adminUser: User) => React.ReactElement | React.ReactElement[] | string
}
const AdminUserCard = (props: AdminUserCardProps) => {
  const {adminUser, renderAdminUserActions} = props

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
          onChange={(e) => props.onAdminUserSelected(adminUser.ID, e.target.checked)}
        />
        <Spacer />
        {renderAdminUserActions && renderAdminUserActions(adminUser)}
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" w="full">
        <Badge colorScheme={adminUser.Active ? "success" : "danger"}>{adminUser.Active ? "Active" : "Inactive"}</Badge>
        <Link passHref style={{cursor: "pointer"}} href={"/settings/adminusers/" + adminUser.ID}>
          <Heading as="a" fontSize="lg">
            <Tooltip label={adminUser.FirstName + " " + adminUser.LastName} placement="top">
              <Text as="span" noOfLines={1}>
                {adminUser.FirstName} {adminUser.LastName}
              </Text>
            </Tooltip>
          </Heading>
        </Link>
      </VStack>
    </VStack>
  )
}

export default AdminUserCard

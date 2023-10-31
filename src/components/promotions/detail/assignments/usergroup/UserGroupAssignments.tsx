import {Control, useFieldArray} from "react-hook-form"
import {Heading, Text, Flex, VStack} from "@chakra-ui/react"
import {UserGroupTable} from "./UserGroupTable"
import {UserGroupSelect} from "./UserGroupSelect"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {PromotionDetailFormFields} from "../../PromotionDetail"
import {PromotionAssignment} from "ordercloud-javascript-sdk"

interface UserGroupAssignmentsProps {
  control: Control<PromotionDetailFormFields>
}
export function UserGroupAssignments({control}: UserGroupAssignmentsProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: `PromotionAssignments`
  })

  const usergroupAssignments = fields.filter((f) => f.UserGroupID)

  const handleUserGroupAdd = (newUserGroupSelections: PromotionAssignment[]) => {
    append(newUserGroupSelections)
  }

  const handleUserGroupRemove = (buyerId: string, userGroupId: string) => {
    const index = fields.findIndex((f) => f.BuyerID === buyerId && f.UserGroupID === userGroupId)
    remove(index)
  }

  return (
    <VStack width="full">
      <VStack alignItems="flex-start" width="full">
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Usergroups
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Define which usergroups this promotion is assigned to
          </Text>
        </Heading>
        <ProtectedContent hasAccess={appPermissions.PromotionManager}>
          <UserGroupSelect onUpdate={handleUserGroupAdd} existingAssignments={usergroupAssignments} />
        </ProtectedContent>
      </VStack>
      <VStack width="full">
        {usergroupAssignments.length > 0 ? (
          <UserGroupTable usergroupAssignments={usergroupAssignments} onRemove={handleUserGroupRemove} />
        ) : (
          <Flex w="full" justifyContent="flex-start" marginTop={10}>
            <Text color="chakra-placeholder-color" fontSize="small">
              This promotion is not assigned to any usergroups
            </Text>
          </Flex>
        )}
      </VStack>
    </VStack>
  )
}

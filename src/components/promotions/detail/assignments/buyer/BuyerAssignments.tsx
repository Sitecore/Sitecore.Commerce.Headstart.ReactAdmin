import ProtectedContent from "@/components/auth/ProtectedContent"
import {Card, CardHeader, Heading, CardBody, Flex, Text, VStack, HStack} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import {PromotionAssignment} from "ordercloud-javascript-sdk"
import {Control, useFieldArray} from "react-hook-form"
import {BuyerSelect} from "./BuyerSelect"
import {BuyerTable} from "./BuyerTable"
import {PromotionDetailFormFields} from "../../PromotionDetail"

interface BuyerAssignmentsProps {
  control: Control<PromotionDetailFormFields>
}
export function BuyerAssignments({control}: BuyerAssignmentsProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: `PromotionAssignments`
  })

  const buyerLevelPromotionAssignments = fields.filter((f) => !f.UserGroupID)

  const handleBuyerAdd = (buyerIds: string[]) => {
    // PromotionID is added on create or update
    const newBuyerAssignment: PromotionAssignment[] = buyerIds.map((buyerId) => ({BuyerID: buyerId}))
    append(newBuyerAssignment)
  }

  const handleBuyerRemove = (buyerId: string) => {
    const index = fields.findIndex((f) => f.BuyerID === buyerId && !f.UserGroupID)
    remove(index)
  }

  return (
    <VStack width="full">
      <VStack alignItems="flex-start" width="full">
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Buyers
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Define which buyer organizations this promotion is assigned to
          </Text>
        </Heading>
        <ProtectedContent hasAccess={appPermissions.PromotionManager}>
          <BuyerSelect onUpdate={handleBuyerAdd} existingAssignments={fields} />
        </ProtectedContent>
      </VStack>
      <VStack width="full">
        {buyerLevelPromotionAssignments.length > 0 ? (
          <BuyerTable assignments={buyerLevelPromotionAssignments} onRemove={handleBuyerRemove} />
        ) : (
          <Flex w="full" justifyContent="flex-start" marginTop={10}>
            <Text color="gray.400" fontSize="small">
              This promotion is not assigned to any buyer organizations
            </Text>
          </Flex>
        )}
      </VStack>
    </VStack>
  )
}

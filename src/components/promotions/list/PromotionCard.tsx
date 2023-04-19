import {Badge, Checkbox, Flex, Heading, Spacer, Text, Tooltip, VStack} from "@chakra-ui/react"
import {User} from "ordercloud-javascript-sdk"
import Link from "next/link"
import {IPromotion} from "types/ordercloud/IPromotion"

interface PromotionCardProps {
  promotion: IPromotion
  selected: boolean
  onPromotionSelected: (promotionId: string, selected: boolean) => void
  renderPromotionActions?: (promotion: IPromotion) => React.ReactElement | React.ReactElement[] | string
}
const PromotionCard = (props: PromotionCardProps) => {
  const {promotion, renderPromotionActions, onPromotionSelected} = props

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
        <Checkbox isChecked={props.selected} onChange={(e) => onPromotionSelected(promotion.ID, e.target.checked)} />
        <Spacer />
        {renderPromotionActions && renderPromotionActions(promotion)}
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" w="full">
        <Badge colorScheme={promotion.Active ? "success" : "danger"}>{promotion.Active ? "Active" : "Inactive"}</Badge>
        <Link passHref style={{cursor: "pointer"}} href={"/settings/adminusers/" + promotion.ID}>
          <Heading as="a" fontSize="lg">
            <Tooltip label={promotion.Name} placement="top">
              <Text as="span" noOfLines={1}>
                {promotion.Name}
              </Text>
            </Tooltip>
          </Heading>
        </Link>
      </VStack>
    </VStack>
  )
}

export default PromotionCard

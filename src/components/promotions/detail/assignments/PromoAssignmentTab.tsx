import {SwitchControl} from "@/components/react-hook-form"
import {Divider, VStack} from "@chakra-ui/react"
import {Control, useWatch} from "react-hook-form"
import {PromotionDetailFormFields} from "../PromotionDetail"
import {BuyerAssignments} from "./buyer/BuyerAssignments"
import {UserGroupAssignments} from "./usergroup/UserGroupAssignments"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface PromoAssignmentTabProps {
  control: Control<PromotionDetailFormFields>
  validationSchema: any
}
export function PromoAssignmentTab({control, validationSchema}: PromoAssignmentTabProps) {
  const allowAllBuyers = useWatch({control, name: "Promotion.AllowAllBuyers"})
  const isPromotionManager = useHasAccess(appPermissions.PromotionManager)
  return (
    <VStack gap={3} marginTop={3}>
      <SwitchControl
        name="Promotion.AllowAllBuyers"
        label="Allow all buyers"
        control={control}
        validationSchema={validationSchema}
        tooltipText="If enabled, this promotion will be available to all buyer users. If disabled, you will need to assign this promotion to specific buyers or usergroups."
        isDisabled={!isPromotionManager}
      />
      {!allowAllBuyers && (
        <VStack width="full" marginTop={6}>
          <BuyerAssignments control={control} />
          <Divider my={6} />
          <UserGroupAssignments control={control} />
        </VStack>
      )}
    </VStack>
  )
}

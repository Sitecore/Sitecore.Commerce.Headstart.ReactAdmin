import {SwitchControl, InputControl, TextareaControl} from "@/components/react-hook-form"
import {VStack} from "@chakra-ui/react"
import {Control} from "react-hook-form"
import {PromotionDetailFormFields} from "../PromotionDetail"
import {OwnerIdSelect} from "@/components/shared/OwnerIdSelect"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface DetailsTabProps {
  control: Control<PromotionDetailFormFields>
  validationSchema: any
  isCreatingNew: boolean
}
export function DetailsTab({control, validationSchema, isCreatingNew}: DetailsTabProps) {
  const isPromotionManager = useHasAccess(appPermissions.PromotionManager)
  return (
    <VStack gap={3} marginTop={3}>
      <SwitchControl
        name="Promotion.Active"
        label="Active"
        control={control}
        validationSchema={validationSchema}
        isDisabled={!isPromotionManager}
      />
      <InputControl
        name="Promotion.Name"
        label="Name"
        control={control}
        validationSchema={validationSchema}
        isDisabled={!isPromotionManager}
      />
      <InputControl
        name="Promotion.Code"
        label="Code"
        control={control}
        validationSchema={validationSchema}
        isDisabled={!isPromotionManager}
      />
      <OwnerIdSelect
        name="Promotion.OwnerID"
        label="Owner ID"
        control={control}
        validationSchema={validationSchema}
        isCreatingNew={isCreatingNew}
        isDisabled={!isPromotionManager}
      />

      <TextareaControl
        name="Promotion.Description"
        label="Description"
        control={control}
        validationSchema={validationSchema}
        isDisabled={!isPromotionManager}
      />
      <TextareaControl
        name="Promotion.FinePrint"
        label="Fine print"
        control={control}
        validationSchema={validationSchema}
        isDisabled={!isPromotionManager}
      />
    </VStack>
  )
}

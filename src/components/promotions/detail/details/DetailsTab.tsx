import {SwitchControl, InputControl, TextareaControl} from "@/components/react-hook-form"
import {Button, VStack} from "@chakra-ui/react"
import {Control, useController} from "react-hook-form"
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
  const {
    field: {onChange: onPromoCodeChange}
  } = useController({control, name: "Promotion.Code"})

  const generateCode = () => {
    const code = Math.random().toString(36).slice(2).substring(0, 5).toUpperCase()
    console.log("code", code)
    onPromoCodeChange(code)
  }
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
        rightElement={<Button onClick={() => generateCode()}>Generate code</Button>}
        rightElementProps={{minWidth: "8rem"}}
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

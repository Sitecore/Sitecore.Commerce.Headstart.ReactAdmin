import SubmitButton from "@/components/react-hook-form/submit-button"
import {Button, HStack, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {FormEvent} from "react"
import {PriceForm} from "../PriceForm"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import {defaultValues, priceScheduleSchema, validationSchema} from "../../form-meta"

interface UpdatePriceModalContentProps {
  priceSchedule?: OverridePriceScheduleFieldValues
  onStepChange: (step: "editprice" | "assignprice") => void
  onUpdate: (data: OverridePriceScheduleFieldValues) => void
  onCancelModal: () => void
}
export function UpdatePriceModalContent({
  priceSchedule,
  onStepChange,
  onUpdate,
  onCancelModal
}: UpdatePriceModalContentProps) {
  const initialValues = priceSchedule || defaultValues.DefaultPriceSchedule
  const {handleSubmit, control, reset, trigger} = useForm<OverridePriceScheduleFieldValues>({
    mode: "onBlur",
    resolver: yupResolver(priceScheduleSchema) as any,
    defaultValues: initialValues
  })

  const onSubmit = (data: OverridePriceScheduleFieldValues) => {
    onUpdate(data)
    onStepChange("assignprice")
  }

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  const handleCancel = () => {
    onCancelModal()
    reset()
  }

  return (
    <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalHeader>Define Price</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <PriceForm
          control={control}
          trigger={trigger}
          fieldNamePrefix={``}
          priceBreakCount={priceSchedule?.PriceBreaks?.length || 0}
        />
      </ModalBody>
      <ModalFooter>
        <HStack justifyContent="space-between" w="100%">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <SubmitButton control={control} variant="solid" colorScheme="primary">
            Assign price
          </SubmitButton>
        </HStack>
      </ModalFooter>
    </ModalContent>
  )
}

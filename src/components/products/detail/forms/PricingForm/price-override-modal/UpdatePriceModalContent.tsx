import SubmitButton from "@/components/react-hook-form/submit-button"
import {Button, HStack, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {object} from "yup"
import {FormEvent} from "react"
import {SinglePricingForm} from "../SinglePricingForm"
import {formShape} from "../formShape"
import {defaultValues} from "../defaultValues"
import {makeNestedObject, withDefaultValuesFallback} from "utils"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"

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
  const initialValues = priceSchedule
    ? withDefaultValuesFallback(priceSchedule, defaultValues)
    : makeNestedObject(defaultValues)
  const {handleSubmit, control, reset, trigger} = useForm({
    mode: "onBlur",
    resolver: yupResolver(object().shape(formShape)),
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
        <SinglePricingForm
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

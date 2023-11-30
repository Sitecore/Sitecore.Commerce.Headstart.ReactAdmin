import {InputControl, TextareaControl} from "@/components/react-hook-form"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {ModalBody, ModalFooter, HStack, Button, VStack, Box} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {FormEvent} from "react"
import {useForm} from "react-hook-form"
import {IShipment} from "types/ordercloud/IShipment"
import {emptyStringToNull} from "utils"
import {number, object, string} from "yup"

interface ShipmentDetailsModalContentProps {
  shipment?: IShipment
  onStepChange: (step: number) => void
  onUpdate: (data: IShipment) => void
  onCancelModal: () => void
}
export function ShipmentDetailsModalContent({
  shipment,
  onStepChange,
  onUpdate,
  onCancelModal
}: ShipmentDetailsModalContentProps) {
  const defaultValues: Partial<IShipment> = {
    xp: {}
  }
  const validationSchema = object().shape({
    TrackingNumber: string()
      .required("Tracking number is required")
      .max(3000, "Tracking number must be less than 3000 characters"),
    Shipper: string().required("Carrier is a required field").max(50, "Carrier must be less than 50 characters"),
    Cost: number().min(0).transform(emptyStringToNull).nullable(),
    DateShipped: string().required("Shipping date is a required field"),
    xp: object().shape({
      ShippingMethod: string().max(50, "Shipping method must be less than 50 characters"),
      Comments: string().max(3000, "Comments must be less than 3000 characters")
    })
  })

  const {handleSubmit, control, reset} = useForm<IShipment>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema) as any,
    defaultValues: shipment || defaultValues
  })

  const onSubmit = (data: IShipment) => {
    onUpdate(data)
    onStepChange(3)
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
    <Box as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalBody>
        <VStack gap={3}>
          <InputControl
            name="TrackingNumber"
            label="Tracking number"
            control={control}
            validationSchema={validationSchema}
          />
          <HStack width="full">
            <InputControl name="Shipper" label="Carrier" control={control} validationSchema={validationSchema} />
            <InputControl
              name="xp.ShippingMethod"
              label="Shipping method"
              control={control}
              validationSchema={validationSchema}
            />
          </HStack>
          <HStack width="full">
            <InputControl
              name="Cost"
              label="Cost"
              leftAddon="$"
              control={control}
              validationSchema={validationSchema}
              inputProps={{type: "number"}}
            />
            <InputControl
              name="DateShipped"
              label="Shipping date"
              control={control}
              validationSchema={validationSchema}
              inputProps={{type: "date"}}
            />
          </HStack>
          <TextareaControl name="xp.Comments" label="Comments" control={control} validationSchema={validationSchema} />
        </VStack>
      </ModalBody>
      <ModalFooter>
        <HStack justifyContent="space-between" w="100%">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <HStack>
            <Button onClick={() => onStepChange(1)}>Select items</Button>
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Review
            </SubmitButton>
          </HStack>
        </HStack>
      </ModalFooter>
    </Box>
  )
}

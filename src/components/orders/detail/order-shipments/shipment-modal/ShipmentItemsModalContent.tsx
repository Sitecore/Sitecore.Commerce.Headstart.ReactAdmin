import SubmitButton from "@/components/react-hook-form/submit-button"
import {ModalBody, ModalFooter, HStack, Button, Flex, FormControl, FormErrorMessage, Box} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {FormEvent} from "react"
import {useForm} from "react-hook-form"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipmentItem} from "types/ordercloud/IShipmentItem"
import {array, number, object, string} from "yup"
import {ShipmentItemTableEditable} from "../ShipmentItemTableEditable"
import {emptyStringToNull} from "utils"
import {InfoOutlineIcon} from "@chakra-ui/icons"

interface ShipmentItemsModalContentProps {
  orderID: string
  originalShipmentItems: IShipmentItem[]
  shipmentItems: IShipmentItem[]
  lineItems: ILineItem[]
  onUpdate: (data: IShipmentItem[]) => void
  onStepChange: (step: number) => void
  onCancelModal: () => void
  isExistingShipment: boolean
}
export function ShipmentItemsModalContent({
  orderID,
  originalShipmentItems,
  shipmentItems,
  lineItems,
  onCancelModal,
  onStepChange,
  onUpdate,
  isExistingShipment
}: ShipmentItemsModalContentProps) {
  const validationSchema = object().shape({
    ShipmentItems: array()
      .test({
        name: "has-shipment-items",
        message: "Please add at least one shipment item",
        test: (shipmentItems = []) => {
          return shipmentItems.some((shipmentItem) => shipmentItem.QuantityShipped)
        }
      })
      .of(
        object().shape({
          OrderID: string().required("Order ID is required"),
          LineItemID: string().required("Line item ID is required"),
          QuantityShipped: number().min(0).transform(emptyStringToNull).nullable()
        })
      )
  })

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: {errors}
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ShipmentItems: lineItems.map((lineItem) => {
        const shipmentItem = shipmentItems.find((shipmentItem) => shipmentItem.LineItemID === lineItem.ID)
        return {
          OrderID: orderID,
          LineItemID: lineItem.ID,
          QuantityShipped: shipmentItem?.QuantityShipped || ""
        }
      })
    } as any
  })

  const onSubmit = (data: {ShipmentItems: IShipmentItem[]}) => {
    const updatedShipmentItems = data.ShipmentItems.filter((shipmentItem: any) => shipmentItem.QuantityShipped !== null)
    onUpdate(updatedShipmentItems)
    onStepChange(2)
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

  const handleShipAllItems = () => {
    const updatedShipmentItems = lineItems.map((lineItem) => {
      let max = lineItem.Quantity - lineItem.QuantityShipped
      if (isExistingShipment) {
        const shipmentItem = originalShipmentItems.find((shipmentItem) => shipmentItem.LineItemID === lineItem.ID)
        if (shipmentItem) {
          max += shipmentItem.QuantityShipped
        }
      }
      return {
        OrderID: orderID,
        LineItemID: lineItem.ID,
        QuantityShipped: max
      }
    })
    setValue("ShipmentItems", updatedShipmentItems)
  }

  const shipmentItemsErrorMessage = errors?.ShipmentItems?.message as any

  return (
    <Box as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalBody>
        <Flex justifyContent="end" width="full" marginBottom={5}>
          <Button onClick={handleShipAllItems} size="sm" colorScheme="accent" variant="outline">
            Ship all items
          </Button>
        </Flex>
        <ShipmentItemTableEditable
          isExistingShipment={isExistingShipment}
          lineItems={lineItems}
          originalShipmentItems={originalShipmentItems}
          control={control}
          validationSchema={validationSchema}
          name="ShipmentItems"
        />
        <FormControl isInvalid={shipmentItemsErrorMessage} maxWidth="max-content">
          <FormErrorMessage display="inline-block">
            <InfoOutlineIcon mr={2} /> {shipmentItemsErrorMessage}
          </FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <HStack justifyContent="space-between" w="100%">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <SubmitButton control={control} variant="solid" colorScheme="primary" marginLeft={3}>
            Enter details
          </SubmitButton>
        </HStack>
      </ModalFooter>
    </Box>
  )
}

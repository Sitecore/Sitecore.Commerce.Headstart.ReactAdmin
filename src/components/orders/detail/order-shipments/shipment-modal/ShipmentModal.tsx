import {
  Button,
  ButtonProps,
  MenuItem,
  MenuItemProps,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useSteps
} from "@chakra-ui/react"
import {PropsWithChildren, useEffect, useState} from "react"
import {IShipment} from "types/ordercloud/IShipment"
import {ShipmentDetailsModalContent} from "./ShipmentDetailsModalContent"
import {ShipmentItemsModalContent} from "./ShipmentItemsModalContent"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipmentItem} from "types/ordercloud/IShipmentItem"
import {getObjectDiff} from "utils"
import {Shipments} from "ordercloud-javascript-sdk"
import {differenceBy, omit} from "lodash"
import {ShipmentReviewModalContent} from "./ShipmentReviewModalContent"
import {IOrder} from "types/ordercloud/IOrder"
import {ShipmentStepper} from "./ShipmentStepper"

interface ShipmentModalProps extends PropsWithChildren {
  order: IOrder
  shipment?: IShipment
  lineItems?: ILineItem[]
  onUpdate: () => void
  buttonProps?: ButtonProps
  menuItemProps?: MenuItemProps
  as: "button" | "menuitem"
}
export function ShipmentModal({
  order,
  shipment,
  lineItems,
  onUpdate,
  as,
  buttonProps,
  menuItemProps,
  children
}: ShipmentModalProps) {
  const steps = ["Select items", "Enter details", "Review"]
  const {activeStep, setActiveStep} = useSteps({index: 1, count: steps.length})
  const [loading, setLoading] = useState(false)
  const [currentShipment, setCurrentShipment] = useState<IShipment | null>(shipment)
  const {isOpen, onOpen, onClose} = useDisclosure()

  useEffect(() => {
    // if shipment data is refreshed from parent
    // then update the current shipment
    setCurrentShipment(shipment)
  }, [shipment])

  const handleCancel = () => {
    onClose()
    setActiveStep(1) // reset to initial step
    setCurrentShipment(shipment) // reset to initial shipment
  }

  const setCurrentItems = (shipmentItems: IShipmentItem[]) => {
    setCurrentShipment({
      ...currentShipment,
      ShipmentItems: shipmentItems.filter((item) => item.QuantityShipped > 0)
    })
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const diff = getObjectDiff(shipment, currentShipment) as Partial<IShipment>
      if (Object.keys(diff).length === 0) {
        return handleCancel()
      }

      // update or create shipment
      const isUpdatingShipmentItemsOnly = Object.keys(diff).length === 1 && diff.ShipmentItems
      const isUpdatingShipment = !isUpdatingShipmentItemsOnly
      // in order to properly trigger order shipped emails, the DateShipped property must be null on initial post
      // and then updated once the shipment items have been created
      const shipBody = omit(diff, "DateShipped")
      let updatedShipment: IShipment = shipment
      if (isUpdatingShipment) {
        if (shipment?.ID) {
          updatedShipment = await Shipments.Patch<IShipment>(shipment.ID, shipBody)
        } else {
          updatedShipment = await Shipments.Create<IShipment>(shipBody)
        }
      }

      // update or create shipment items
      const isUpdatingShipmentItems = diff.ShipmentItems
      if (isUpdatingShipmentItems) {
        const removedShipmentItems = differenceBy(
          shipment?.ShipmentItems || [],
          currentShipment.ShipmentItems,
          (s) => s.LineItemID
        )

        const updateShipments = differenceBy(
          currentShipment.ShipmentItems,
          shipment?.ShipmentItems || [],
          (s) => s.LineItemID + s.QuantityShipped
        )

        const removeShipmentItemsRequests = removedShipmentItems.map((shipmentItem) =>
          Shipments.DeleteItem(updatedShipment.ID, shipmentItem.OrderID, shipmentItem.LineItemID)
        )

        const updateShipmentItemsRequests = updateShipments.map((shipmentItem) => {
          return Shipments.SaveItem(updatedShipment.ID, shipmentItem)
        })

        await Promise.all([...removeShipmentItemsRequests, ...updateShipmentItemsRequests])
      }

      // update order shipped, if all line items have shipped then this will transition the order status to 'Complete'
      if (diff.DateShipped) {
        // update order shipped, if all line items on the order have shipped then
        // this will automatically transition the order status to 'Complete'
        await Shipments.Patch(updatedShipment.ID, {DateShipped: diff.DateShipped})
      }

      onUpdate()
      setCurrentShipment(shipment) // reset to initial shipment
      setActiveStep(1) // reset to initial step
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {as === "button" ? (
        <Button {...buttonProps} onClick={onOpen}>
          {children}
        </Button>
      ) : (
        <MenuItem onClick={onOpen} {...menuItemProps}>
          {children}
        </MenuItem>
      )}
      <Modal size="2xl" isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader marginTop={7}>
            <ShipmentStepper activeStep={activeStep} steps={steps} />
          </ModalHeader>
          <ModalCloseButton />
          {activeStep === 1 && (
            <ShipmentItemsModalContent
              isExistingShipment={Boolean(shipment?.ID)}
              orderID={order.ID}
              originalShipmentItems={shipment?.ShipmentItems || []}
              shipmentItems={currentShipment?.ShipmentItems || []}
              lineItems={lineItems}
              onStepChange={setActiveStep}
              onUpdate={setCurrentItems}
              onCancelModal={handleCancel}
            />
          )}
          {activeStep === 2 && (
            <ShipmentDetailsModalContent
              shipment={currentShipment}
              onStepChange={setActiveStep}
              onUpdate={setCurrentShipment}
              onCancelModal={handleCancel}
            />
          )}
          {activeStep === 3 && (
            <ShipmentReviewModalContent
              shipment={currentShipment}
              lineItems={lineItems}
              loading={loading}
              onStepChange={setActiveStep}
              onUpdate={onSubmit}
              onCancelModal={handleCancel}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

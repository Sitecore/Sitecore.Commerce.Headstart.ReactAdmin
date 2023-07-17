import {ModalBody, ModalFooter, HStack, Button} from "@chakra-ui/react"
import {ShipmentSummary} from "../ShipmentSummary"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipment} from "types/ordercloud/IShipment"

interface ShipmentReviewModalContentProps {
  shipment?: IShipment
  lineItems: ILineItem[]
  onStepChange: (step: number) => void
  onUpdate: () => void
  onCancelModal: () => void
  loading: boolean
}
export function ShipmentReviewModalContent({
  shipment,
  lineItems,
  onUpdate,
  onCancelModal,
  onStepChange,
  loading
}: ShipmentReviewModalContentProps) {
  return (
    <>
      <ModalBody>
        <ShipmentSummary shipment={shipment} lineItems={lineItems} />
      </ModalBody>
      <ModalFooter>
        <HStack justifyContent="space-between" w="100%">
          <Button onClick={onCancelModal} variant="outline">
            Cancel
          </Button>
          <HStack>
            <Button onClick={() => onStepChange(2)}>Edit shipment</Button>
            <Button variant="solid" colorScheme="primary" onClick={onUpdate} isLoading={loading}>
              {shipment?.ID ? "Update shipment" : "Create shipment"}
            </Button>
          </HStack>
        </HStack>
      </ModalFooter>
    </>
  )
}

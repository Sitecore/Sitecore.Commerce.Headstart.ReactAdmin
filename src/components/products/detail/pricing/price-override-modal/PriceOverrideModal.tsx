import {Button, ButtonProps, MenuItem, MenuItemProps, Modal, ModalOverlay, useDisclosure} from "@chakra-ui/react"
import {useState} from "react"
import {UpdatePriceModalContent} from "./UpdatePriceModalContent"
import {AssignPriceModalContent} from "./AssignPriceModalContent"
import {ProductAssignment} from "ordercloud-javascript-sdk"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"

interface PriceOverrideModalProps {
  onUpdate: (priceSchedule: OverridePriceScheduleFieldValues) => void
  step: "editprice" | "assignprice"
  priceSchedule?: OverridePriceScheduleFieldValues
  buttonProps?: ButtonProps
  menuItemProps?: MenuItemProps
  as: "button" | "menuitem"
}
export function PriceOverrideModal({
  buttonProps,
  menuItemProps,
  onUpdate,
  priceSchedule,
  step = "editprice",
  as = "button"
}: PriceOverrideModalProps) {
  const [currentPriceSchedule, setCurrentPriceSchedule] = useState<OverridePriceScheduleFieldValues | null>(
    priceSchedule
  )
  const [currentStep, setCurrentStep] = useState(step)
  const {isOpen, onOpen, onClose} = useDisclosure()

  const handleCancel = () => {
    onClose()
    setCurrentStep(step) // reset to initial step
  }

  const onSubmit = (productAssignments: ProductAssignment[]) => {
    currentPriceSchedule.ProductAssignments = productAssignments
    onUpdate(currentPriceSchedule)
    setCurrentPriceSchedule(priceSchedule) // reset to initial price schedule
    setCurrentStep(step) // reset to initial step
    onClose()
  }

  return (
    <>
      {as === "button" ? (
        <Button {...buttonProps} onClick={onOpen}>
          {buttonProps.children || "Add price override"}
        </Button>
      ) : (
        <MenuItem onClick={onOpen} {...menuItemProps} />
      )}

      <Modal size="6xl" isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        {currentStep === "editprice" ? (
          <UpdatePriceModalContent
            priceSchedule={currentPriceSchedule}
            onStepChange={setCurrentStep}
            onCancelModal={handleCancel}
            onUpdate={setCurrentPriceSchedule}
          />
        ) : (
          <AssignPriceModalContent
            productAssignments={currentPriceSchedule?.ProductAssignments}
            onCancelModal={handleCancel}
            onStepChange={setCurrentStep}
            onUpdate={onSubmit}
          />
        )}
      </Modal>
    </>
  )
}

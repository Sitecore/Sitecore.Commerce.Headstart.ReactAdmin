import {Button, ButtonProps, MenuItem, MenuItemProps, Modal, ModalOverlay, useDisclosure} from "@chakra-ui/react"
import {CategoryAssignmentModalContent} from "./CategoryAssignmentModalContent"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"

interface CategoryAssignmentModalProps {
  onUpdate: (categoryAssignments: ICategoryProductAssignment[]) => void
  categoryAssignments?: ICategoryProductAssignment[]
  buttonProps?: ButtonProps
  menuItemProps?: MenuItemProps
  as: "button" | "menuitem"
}

export function CategoryAssignmentModal({
  buttonProps,
  menuItemProps,
  onUpdate,
  categoryAssignments,
  as
}: CategoryAssignmentModalProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const handleCancel = () => {
    onClose()
  }

  const onSubmit = (data: ICategoryProductAssignment[]) => {
    onUpdate(data)
    onClose()
  }

  return (
    <>
      {as === "button" ? (
        <Button {...buttonProps} onClick={onOpen}>
          {buttonProps.children || "Add category assignment"}
        </Button>
      ) : (
        <MenuItem onClick={onOpen} {...menuItemProps} />
      )}

      <Modal size="3xl" isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <CategoryAssignmentModalContent
          categoryAssignments={categoryAssignments}
          onUpdate={onSubmit}
          onCancelModal={handleCancel}
        ></CategoryAssignmentModalContent>
      </Modal>
    </>
  )
}

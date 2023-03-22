import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  MenuItem,
  useDisclosure
} from "@chakra-ui/react"
import {useRef} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"

interface ConfirmDeleteDialogProps {
  onDelete: () => Promise<void>
  loading: boolean
  variant?: "button" | "menuitem"
  deleteText?: string
  alertHeaderText?: string
  alertBodyText?: string
  alertCancelButtonText?: string
  alertDeleteButtonText?: string
}
export default function ConfirmDelete({
  onDelete,
  loading,
  variant = "button",
  deleteText = "Delete",
  alertHeaderText = "Are you sure you want to delete this?",
  alertBodyText = "This action can not be undone",
  alertCancelButtonText = "No, do not delete",
  alertDeleteButtonText = "Yes, delete"
}: ConfirmDeleteDialogProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef()

  return (
    <>
      {variant === "button" ? (
        <Button variant="outline" onClick={onOpen} disabled={loading}>
          {loading ? <BrandedSpinner /> : deleteText}
        </Button>
      ) : (
        <MenuItem color="red.500" onClick={onOpen}>
          {loading ? <BrandedSpinner /> : deleteText}
        </MenuItem>
      )}
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alertHeaderText}
            </AlertDialogHeader>

            <AlertDialogBody>{alertBodyText}</AlertDialogBody>

            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button variant="outline" onClick={onClose} ref={cancelRef}>
                  {alertCancelButtonText}
                </Button>
                <Button variant="solid" colorScheme="red" onClick={onDelete} ml={3}>
                  {alertDeleteButtonText}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

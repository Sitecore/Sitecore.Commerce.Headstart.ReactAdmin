import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {useRef} from "react"

interface ViewProductProps {}
export default function ViewProduct({}: ViewProductProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef()

  const onViewProduct = () => {
    console.log("Demo Feature >> Not implemented!")
    onClose()
  }

  return (
    <>
      <Button variant="secondaryButton" onClick={onOpen}>
        View Product
      </Button>
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              View Product
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">View what this product will look like on a product details page.</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button onClick={onClose} variant="secondaryButton" ref={cancelRef}>
                  Cancel
                </Button>
                <Button variant="primaryButton" onClick={onViewProduct}>
                  View Product
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

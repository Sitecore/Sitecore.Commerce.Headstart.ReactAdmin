import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Hide,
  HStack,
  Menu,
  MenuItem,
  Show,
  Text,
  theme,
  useDisclosure,
  useMediaQuery
} from "@chakra-ui/react"
import {useRef} from "react"
import {TbShoppingCartPlus} from "react-icons/tb"

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
      <Hide below="md">
        <Button variant="outline" onClick={onOpen}>
          View Product
        </Button>
      </Hide>
      <Hide above="md">
        <Button
          variant="unstyled"
          px={3}
          _hover={{backgroundColor: "gray.100"}}
          w="full"
          textAlign="left"
          borderRadius="0"
          fontWeight="normal"
          leftIcon={<TbShoppingCartPlus size="1rem" />}
          onClick={onOpen}
        >
          View Product
        </Button>
      </Hide>
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
                <Button onClick={onClose} variant="outline" ref={cancelRef}>
                  Cancel
                </Button>
                <Button variant="solid" colorScheme="primary" onClick={onViewProduct}>
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

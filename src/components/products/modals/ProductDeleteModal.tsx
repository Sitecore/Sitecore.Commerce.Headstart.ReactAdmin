import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureProps
} from "@chakra-ui/react"
import {FC, useMemo} from "react"
import {IProduct} from "types/ordercloud/IProduct"

interface IProductDeleteModal {
  products?: IProduct[]
  disclosure: UseDisclosureProps
}

const ProductDeleteModal: FC<IProductDeleteModal> = ({products, disclosure}) => {
  const {isOpen, onClose} = disclosure
  const individual = useMemo(() => {
    if (products && products.length === 1) {
      return products[0]
    }
  }, [products])
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {individual && (
            <>
              <Alert colorScheme="orange" mb={5}>
                You are about to delete a product. This is a destructive action and cannot be undone.
              </Alert>
              <FormControl size="sm">
                <FormLabel>Please type the full product name to continue</FormLabel>
                <Input placeholder={individual.Name} />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red">Delete Product</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductDeleteModal

import {
  Alert,
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {FC, useEffect, useState, useCallback} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import ProductThumbnail from "../list/ProductThumbnail"

interface IProductDeleteModal {
  products?: IProduct[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const ProductDeleteModal: FC<IProductDeleteModal> = ({products, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showProducts, setShowProducts] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowProducts(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      onComplete(products.map((p) => p.ID))
      onClose()
    }, 2000)
  }, [onComplete, products])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {loading && (
          <Center position="absolute" left={0} w="full" h="full" bg="whiteAlpha.500" zIndex={2} color="teal">
            <Spinner></Spinner>
          </Center>
        )}
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb={5}>
            <Heading size="sm" as="h5">
              {`Deleting ${products.length} Selected Product${products.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowProducts((s) => !s)}>
              {showProducts ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showProducts}>
            <List mb={5}>
              {products.map((p, i) => (
                <>
                  <ListItem key={p.ID} as={HStack}>
                    <ProductThumbnail product={p} />
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{p.ID}</Badge>
                        <Text>{p.Name}</Text>
                      </VStack>
                      <Tag colorScheme={p.Active ? "green" : "red"}>{p.Active ? "Active" : "Inactive"}</Tag>
                    </HStack>
                  </ListItem>
                  {i < products.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right product.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductDeleteModal

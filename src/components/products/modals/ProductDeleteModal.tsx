import {
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  Heading,
  HStack,
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
import {FC, useCallback, useEffect, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import ProductDefaultImage from "../../shared/ProductDefaultImage"
import {Products} from "ordercloud-javascript-sdk"

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

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    const productIds = products.map((p) => p.ID)
    const productDeleteRequests = productIds.map((id) => Products.Delete(id))
    await Promise.all(productDeleteRequests)
    onComplete(productIds)
    onClose()
  }, [onComplete, products, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {loading && (
          <Center
            rounded="md"
            position="absolute"
            left={0}
            w="full"
            h="full"
            bg="whiteAlpha.500"
            zIndex={2}
            color="teal"
          >
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
                    <ProductDefaultImage product={p} w="50px" h="50px" fit="cover" mr={2} rounded="6" />
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
        <ModalFooter as={HStack} justifyContent="space-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="danger" onClick={handleSubmit}>
            Delete Product
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductDeleteModal

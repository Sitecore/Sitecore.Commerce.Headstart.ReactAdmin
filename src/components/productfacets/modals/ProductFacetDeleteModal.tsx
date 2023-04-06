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
import {ProductFacets} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IProductFacet} from "types/ordercloud/IProductFacet"

interface IProductFacetDeleteModal {
  productFacets?: IProductFacet[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const ProductFacetDeleteModal: FC<IProductFacetDeleteModal> = ({productFacets, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showProductFacets, setShowProductFacets] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowProductFacets(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(productFacets.map((productFacet) => ProductFacets.Delete(productFacet?.ID)))
      onComplete(productFacets.map((productFacet) => productFacet.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [productFacets, onComplete, onClose])

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
              {`Deleting ${productFacets.length} Selected Product Facet${productFacets.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowProductFacets((s) => !s)}>
              {showProductFacets ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showProductFacets}>
            <List mb={5}>
              {productFacets.map((productFacet, i) => (
                <>
                  <ListItem key={productFacet.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{productFacet.ID}</Badge>
                        <Text>{productFacet.Name}</Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < productFacets.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right product
            facet.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Product Facet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductFacetDeleteModal

import {
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
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
  Radio,
  RadioGroup,
  Spinner,
  Tag,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {Products} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import ProductDefaultImage from "../../shared/ProductDefaultImage"

interface IProductBulkEditModal {
  products?: IProduct[]
  disclosure: UseDisclosureProps
  onComplete: (updated: IProduct[]) => void
}

const ProductBulkEditModal: FC<IProductBulkEditModal> = ({products, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showProducts, setShowProducts] = useState(false)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<boolean>()

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowProducts(false)
      setValue(undefined)
    }
  }, [isOpen])

  const handleUpdateProducts = useCallback(async () => {
    setLoading(true)
    const updatedProducts = await Promise.all(products.map((p) => Products.Patch(p.ID, {Active: Boolean(value)})))
    onComplete(updatedProducts)
    onClose()
  }, [products, value, onComplete, onClose])

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
        <ModalHeader>Bulk Edit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb={5}>
            <Heading size="sm" as="h5">
              {`Editing ${products.length} Selected Product${products.length === 1 ? "" : "s"}`}
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
          <FormControl>
            <FormLabel>Status</FormLabel>
            <RadioGroup
              onChange={(newValue: string) => {
                setValue(newValue === "true")
              }}
              value={String(value)}
            >
              <HStack>
                <Radio value="true">Active</Radio>
                <Radio value="false">Inactive</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter as={HStack} justifyContent="space-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            isDisabled={typeof value === "undefined"}
            onClick={handleUpdateProducts}
          >
            Update Products
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductBulkEditModal

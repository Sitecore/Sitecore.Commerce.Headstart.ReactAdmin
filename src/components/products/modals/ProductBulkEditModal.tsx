import {
  Badge,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
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
  Tag,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {FC, useMemo, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"

interface IProductBulkEditModal {
  products?: IProduct[]
  disclosure: UseDisclosureProps
}

const ProductThumbnail = ({product, width = "50px"}) => {
  const value = useMemo(() => {
    if (product && product.xp && product.xp.Images) {
      return product.xp.Images
    }
  }, [product])
  return (
    <Image
      src={
        value && value.length
          ? value[0]?.ThumbnailUrl ?? value[0]?.Url
          : "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"
      }
      alt="product image"
      width={width}
    />
  )
}

const ProductBulkEditModal: FC<IProductBulkEditModal> = ({products, disclosure}) => {
  const {isOpen, onClose} = disclosure
  const [showProducts, setShowProducts] = useState(false)
  const [value, setValue] = useState<string>()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
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
            <List>
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
          <FormControl>
            <FormLabel>Status</FormLabel>
            <RadioGroup onChange={setValue} value={value}>
              <HStack>
                <Radio value="true">Active</Radio>
                <Radio value="false">Inactive</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" fontSize="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" fontSize="sm" colorScheme="teal" isDisabled={typeof value !== "string"}>
            Update Products
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductBulkEditModal

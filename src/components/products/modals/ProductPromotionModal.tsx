import {
  Badge,
  Button,
  ButtonGroup,
  Divider,
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
  Tag,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {FC, useMemo, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"

interface IProductPromotionModal {
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

const ProductPromotionModal: FC<IProductPromotionModal> = ({products, disclosure}) => {
  const {isOpen, onClose} = disclosure
  const [promotionType, setPromotionType] = useState<string>("shipping")

  const handlePromotionTypeChange = (type: string) => () => {
    setPromotionType(type)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Product Promotion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size="sm" as="h5" mb={5}>
            {`Selected Product${products.length === 1 ? "" : "s"}`}
          </Heading>
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
          <Heading size="sm" as="h5" mb={5}>
            Promotion Type
          </Heading>
          <ButtonGroup w="full" isAttached variant="secondaryButton">
            <Button
              flexGrow={1}
              onClick={handlePromotionTypeChange("shipping")}
              isActive={promotionType === "shipping"}
            >
              Free Shipping
            </Button>
            <Button flexGrow={1} onClick={handlePromotionTypeChange("bogo")} isActive={promotionType === "bogo"}>
              BOGO
            </Button>
            <Button flexGrow={1} onClick={handlePromotionTypeChange("percent")} isActive={promotionType === "percent"}>
              Percent Off
            </Button>
          </ButtonGroup>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" fontSize="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primaryButton">Save Promotion</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductPromotionModal

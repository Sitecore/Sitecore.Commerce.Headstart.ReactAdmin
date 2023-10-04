import {
  Badge,
  Button,
  ButtonGroup,
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
import {FC, useEffect, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import ProductDefaultImage from "../../shared/ProductDefaultImage"

interface IProductPromotionModal {
  products?: IProduct[]
  disclosure: UseDisclosureProps
}

const ProductPromotionModal: FC<IProductPromotionModal> = ({products, disclosure}) => {
  const {isOpen, onClose} = disclosure
  const [showProducts, setShowProducts] = useState(false)
  const [loading, setLoading] = useState(false)
  const [promotionType, setPromotionType] = useState<string>("shipping")

  const handlePromotionTypeChange = (type: string) => () => {
    setPromotionType(type)
  }

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowProducts(false)
      setPromotionType("shipping")
    }
  }, [isOpen])

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

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
        <ModalHeader>New Product Promotion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb={5}>
            <Heading size="sm" as="h5">
              {`Promoting ${products.length} Selected Product${products.length === 1 ? "" : "s"}`}
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
          <Heading size="sm" as="h5" mb={5}>
            Promotion Type
          </Heading>
          <ButtonGroup w="full" isAttached variant="outline">
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
        <ModalFooter as={HStack} justifyContent="space-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" colorScheme="primary" onClick={handleSubmit}>
            Save Promotion
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductPromotionModal

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Image,
  Spinner,
  Text,
  Th,
  Tr,
  VStack
} from "@chakra-ui/react"
import {ComposedProduct, GetComposedProduct, RemoveLineItem, UpdateLineItem} from "../../services/ordercloud.service"
import {FormEvent, FunctionComponent, useCallback, useEffect, useRef, useState} from "react"
import {LineItem} from "ordercloud-javascript-sdk"
import {priceHelper} from "../../utils/price.utils"

interface LineItemCardProps {
  lineItem: LineItem
  editable?: boolean
}

const LineItemCard: FunctionComponent<LineItemCardProps> = ({lineItem, editable}) => {
  const [disabled, setDisabled] = useState(false)
  const [quantity, setQuantity] = useState(lineItem.Quantity)
  const [product, setProduct] = useState<ComposedProduct>()

  useEffect(() => {
    async function GetProduct() {
      var composedProduct = await GetComposedProduct(lineItem?.Product?.ID)
      setProduct(composedProduct)
    }

    GetProduct()
  }, [lineItem])

  const handleRemoveLineItem = useCallback(async () => {
    setDisabled(true)
    await RemoveLineItem(lineItem.ID)
    setDisabled(false)
  }, [lineItem])

  const handleUpdateLineItem = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setDisabled(true)
      await UpdateLineItem({...lineItem, Quantity: quantity})
      setDisabled(false)
    },
    [quantity, lineItem]
  )
  const cancelRef = useRef()
  const [loading, setLoading] = useState(false)
  const [isReturnItemDialogOpen, setReturnItemDialogOpen] = useState(false)
  const requestReturnItem = () => {}

  return (
    <Tr key={lineItem.ID}>
      <Th>
        <HStack>
          <VStack>
            <Image src={lineItem.xp?.proofUrl} maxW="125" alt=""></Image>
          </VStack>
          <Text>{`# ${lineItem.ID}`}</Text>
        </HStack>
      </Th>
      <Th>
        <HStack textAlign="left">
          <Text>{lineItem.Product.Name}</Text>
          {lineItem.Specs.map((s) => (
            <span key={s.SpecID}>
              <br />
              {`${s.Name}: ${s.Value}`}
            </span>
          ))}
        </HStack>
      </Th>
      <Th>Status</Th>
      <Th>
        <p>{lineItem.Quantity}</p>
      </Th>
      <Th>{priceHelper.formatPrice(lineItem.UnitPrice)}</Th>
      <Th>{priceHelper.formatPrice(lineItem.LineSubtotal)}</Th>
      <Th>
        <Button variant="secondaryButton" onClick={() => setReturnItemDialogOpen(true)}>
          Return item
        </Button>
      </Th>
      <AlertDialog
        isOpen={isReturnItemDialogOpen}
        onClose={() => setReturnItemDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Verify this return?
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Once you press the veryfy button in the lower right of this modal an email will be sent to the customer
                along with the return shipping label to make it easier for them to return this item. Once you have
                received this item you will be able to mark the return complete and they will be credited for returning
                this item.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setReturnItemDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestReturnItem} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Verify & Start Return"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Tr>
  )
}

export default LineItemCard

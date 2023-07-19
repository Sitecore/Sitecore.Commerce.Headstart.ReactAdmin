import {SimpleGrid, VStack, Flex, HStack, Text, Box, Divider, Stack} from "@chakra-ui/react"
import {priceHelper} from "utils"
import {ProductThumbnail} from "../order-products/ProductThumbnail"
import {ILineItem} from "types/ordercloud/ILineItem"
import {PropsWithChildren} from "react"
import {OrderLabel} from "../OrderLabel"
import {IShipment} from "types/ordercloud/IShipment"
import {OrderHeaderItem} from "../OrderHeaderItem"
import {Link} from "@/components/navigation/Link"

interface ShipmentItemTableProps extends PropsWithChildren {
  lineItems: ILineItem[]
  shipment: IShipment
  isInModal: boolean
  isMobile: boolean
}
export function ShipmentItemTableSummary({lineItems, shipment, isInModal, isMobile}: ShipmentItemTableProps) {
  const comments = (
    <Box width="full" border="1px solid" borderColor="gray.200" padding="0.7rem" rounded="md">
      <Text fontSize="small" color="gray.400" fontStyle="italic">
        {shipment.xp?.Comments || "No comments"}
      </Text>
    </Box>
  )

  return (
    <VStack width="full">
      <SimpleGrid w="full" gridTemplateColumns={isMobile ? "1fr" : isInModal ? "1fr 1fr" : "1fr 1fr 2fr"} gap={3}>
        <OrderHeaderItem label="Shipment ID" value={shipment.ID} />
        <OrderHeaderItem label="Cost" value={priceHelper.formatPrice(shipment.Cost)} />
        {shipment.xp?.Comments && <OrderHeaderItem flexGrow={1} label="Comments" value={comments} />}
      </SimpleGrid>
      <Divider marginY={4} borderColor="gray.300" />
      {shipment.ShipmentItems.map((shipmentItem) => {
        const lineItem = lineItems.find((lineItem) => lineItem.ID === shipmentItem.LineItemID)
        return (
          <SimpleGrid
            gridTemplateColumns={isInModal && !isMobile ? "1fr 1fr 1fr" : isMobile ? "1fr 1fr" : "1fr 1fr 2fr"}
            key={shipmentItem.LineItemID}
            width="full"
            alignItems="center"
            justifyContent="flex-start"
            gap={4}
          >
            <Stack direction={["column", "row"]} alignItems="center" gap={4}>
              <ProductThumbnail imageProps={{boxSize: 75}} product={lineItem.Product} />
              {!isMobile && (
                <VStack justifyContent="space-between">
                  <Flex flexDirection="column">
                    <Text fontSize="sm">{lineItem.Product.Name}</Text>
                    <Link href={`/products/${lineItem.Product.ID}`}>
                      <Text fontSize="xs" color="gray.400">
                        SKU: {lineItem.Product.ID}
                      </Text>
                    </Link>
                  </Flex>
                </VStack>
              )}
              {isMobile && (
                <HStack>
                  <Text fontSize="xs" color="gray.400">
                    {lineItem.Product.ID}
                  </Text>
                </HStack>
              )}
            </Stack>
            {!isMobile && (
              <VStack alignItems="flex-start" justifyContent="center">
                <HStack>
                  <OrderLabel>QTY: </OrderLabel>
                  <Text fontSize="sm" marginLeft={2}>
                    {lineItem.Quantity}
                  </Text>
                </HStack>
                <HStack>
                  <OrderLabel>TOTAL:</OrderLabel>
                  <Text fontSize="sm" marginLeft={2}>
                    {priceHelper.formatPrice(lineItem.LineTotal)}
                  </Text>
                </HStack>
              </VStack>
            )}
            <Stack direction={["column", "row"]} ml={!isInModal && "auto"}>
              <OrderLabel>QTY SHIPPED:</OrderLabel>
              <Text fontSize="sm" marginLeft={2}>
                {shipmentItem.QuantityShipped}
              </Text>
            </Stack>
          </SimpleGrid>
        )
      })}
    </VStack>
  )
}

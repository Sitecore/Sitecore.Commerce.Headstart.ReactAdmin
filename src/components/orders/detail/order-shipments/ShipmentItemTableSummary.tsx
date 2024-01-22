import {SimpleGrid, VStack, Flex, HStack, Text, Box, Divider, Stack} from "@chakra-ui/react"
import {priceHelper} from "utils"
import {ILineItem} from "types/ordercloud/ILineItem"
import {PropsWithChildren} from "react"
import {IShipment} from "types/ordercloud/IShipment"
import ProductDefaultImage from "@/components/shared/ProductDefaultImage"
import {Link} from "@chakra-ui/next-js"
import {TextLabel} from "@/components/shared/TextLabel"
import {HeaderItem} from "@/components/shared/HeaderItem"

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
        <HeaderItem
          direction={isInModal || isMobile ? "row" : "column"}
          alignItems={isInModal || isMobile ? "center" : "start"}
          label="Shipment ID"
          value={shipment.ID}
        />
        <HeaderItem
          direction={isInModal || isMobile ? "row" : "column"}
          alignItems={isInModal || isMobile ? "center" : "start"}
          label="Cost"
          value={typeof shipment.Cost === "number" ? priceHelper.formatPrice(shipment.Cost) : ""}
        />
        {shipment.xp?.Comments && <HeaderItem flexGrow={1} label="Comments" value={comments} />}
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
              <ProductDefaultImage product={lineItem.Product} />
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
                  <TextLabel>QTY: </TextLabel>
                  <Text fontSize="sm" marginLeft={2}>
                    {lineItem.Quantity}
                  </Text>
                </HStack>
                <HStack>
                  <TextLabel>TOTAL:</TextLabel>
                  <Text fontSize="sm" marginLeft={2}>
                    {priceHelper.formatPrice(lineItem.LineTotal)}
                  </Text>
                </HStack>
              </VStack>
            )}
            <Stack direction={["column", "row"]} ml={!isInModal && "auto"}>
              <TextLabel>QTY SHIPPED:</TextLabel>
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

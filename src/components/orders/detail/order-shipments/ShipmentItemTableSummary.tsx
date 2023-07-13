import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, VStack, Flex, HStack, Text} from "@chakra-ui/react"
import {priceHelper} from "utils"
import {ProductThumbnail} from "../order-products/ProductThumbnail"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipmentItem} from "types/ordercloud/IShipmentItem"
import {PropsWithChildren} from "react"

interface ShipmentItemTableProps extends PropsWithChildren {
  lineItems: ILineItem[]
  shipmentItems: IShipmentItem[]
}
export function ShipmentItemTableSummary({lineItems, shipmentItems}: ShipmentItemTableProps) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Details</Th>
            <Th>Quantity Shipped</Th>
          </Tr>
        </Thead>
        <Tbody>
          {shipmentItems.map((shipmentItem) => {
            const lineItem = lineItems.find((lineItem) => lineItem.ID === shipmentItem.LineItemID)
            return (
              <Tr key={lineItem.ID}>
                <Td>
                  <HStack alignItems="stretch">
                    <ProductThumbnail imageProps={{boxSize: 75}} product={lineItem.Product} />
                    <VStack justifyContent="space-between">
                      <Flex flexDirection="column">
                        <Text fontSize="sm">{lineItem.Product.Name}</Text>
                        <Text fontSize="xs" color="gray.400">
                          SKU: {lineItem.Product.ID}
                        </Text>
                      </Flex>
                      <HStack width="full" justifyContent="space-between">
                        <Text fontSize="xs">Qty: {lineItem.Quantity}</Text>
                        <Text fontSize="xs">{priceHelper.formatPrice(lineItem.LineTotal)}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Td>
                <Td>{shipmentItem.QuantityShipped}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

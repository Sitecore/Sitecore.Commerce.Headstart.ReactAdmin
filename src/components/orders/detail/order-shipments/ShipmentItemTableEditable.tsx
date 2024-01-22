import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, VStack, Flex, HStack, Text} from "@chakra-ui/react"
import {priceHelper} from "utils"
import {Control, FieldValues} from "react-hook-form"
import {SelectControl} from "@/components/react-hook-form"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipmentItem} from "types/ordercloud/IShipmentItem"
import ProductDefaultImage from "@/components/shared/ProductDefaultImage"
import {Link} from "@chakra-ui/next-js"

interface ShipmentItemTableProps {
  lineItems: ILineItem[]
  originalShipmentItems: IShipmentItem[]
  control: Control<FieldValues, any>
  validationSchema: any
  name: string
  isExistingShipment: boolean
}
export function ShipmentItemTableEditable({
  lineItems,
  control,
  validationSchema,
  name,
  originalShipmentItems,
  isExistingShipment
}: ShipmentItemTableProps) {
  const buildQuantityShippedOptions = (lineItem: ILineItem) => {
    let max = lineItem.Quantity - lineItem.QuantityShipped
    if (isExistingShipment) {
      const shipmentItem = originalShipmentItems.find((shipmentItem) => shipmentItem.LineItemID === lineItem.ID)
      if (shipmentItem) {
        max += shipmentItem.QuantityShipped
      }
    }
    const numberArray = Array(max)
      .fill("")
      .map((_, i) => {
        const value = i + 1
        return {
          label: value,
          value
        }
      })
      .reverse()
    return [...numberArray, {label: "Do not ship", value: ""}]
  }
  return (
    // without overflow visible, the dropdown for QuantityShipped may not show fully
    <TableContainer overflowX="visible" overflowY="visible">
      <Table>
        <Thead>
          <Tr>
            <Th>Details</Th>
            <Th>Quantity Shipped</Th>
          </Tr>
        </Thead>
        <Tbody>
          {lineItems.map((lineItem, index) => {
            return (
              <Tr key={lineItem.ID}>
                <Td>
                  <HStack alignItems="stretch">
                    <ProductDefaultImage product={lineItem.Product} />
                    <VStack justifyContent="space-between">
                      <Flex flexDirection="column">
                        <Text
                          fontSize="sm"
                          maxWidth="200px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          title={lineItem.Product.Name}
                        >
                          {lineItem.Product.Name}
                        </Text>
                        <Link href={`/products/${lineItem.Product.ID}`}>
                          <Text fontSize="xs" color="gray.400">
                            SKU: {lineItem.Product.ID}
                          </Text>
                        </Link>
                      </Flex>
                      <HStack width="full" justifyContent="space-between">
                        <Text fontSize="xs">Qty: {lineItem.Quantity}</Text>
                        <Text fontSize="xs">{priceHelper.formatPrice(lineItem.LineTotal)}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <SelectControl
                    control={control}
                    validationSchema={validationSchema}
                    name={`${name}.${index}.QuantityShipped`}
                    selectProps={{
                      options: buildQuantityShippedOptions(lineItem)
                    }}
                  />
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

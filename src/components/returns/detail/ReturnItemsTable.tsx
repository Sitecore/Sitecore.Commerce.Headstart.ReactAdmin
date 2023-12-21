import {
  FormControl,
  Hide,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  VStack,
  Text,
  useMediaQuery,
  theme,
  FormLabel,
  Divider
} from "@chakra-ui/react"
import {ILineItem} from "types/ordercloud/ILineItem"
import {Link} from "@chakra-ui/next-js"
import ProductDefaultImage from "@/components/shared/ProductDefaultImage"
import {OrderReturnItem} from "ordercloud-javascript-sdk"
import {priceHelper} from "utils"

interface ReturnItemsTableProps {
  itemsToReturn: OrderReturnItem[]
  lineItems: ILineItem[]
}

export function ReturnItemsTable({itemsToReturn, lineItems}: ReturnItemsTableProps) {
  const [isMobile] = useMediaQuery(`(max-width: ${theme.breakpoints["md"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  const tableCellPadding = 2

  if (!itemsToReturn.length) {
    return <Text>No items associated with this return</Text>
  }

  return (
    // without overflow visible, the dropdown for Quantity may not show fully
    <TableContainer overflowX="visible" overflowY="visible" w="100%" maxW="container.xl">
      <Table variant={{base: "unstyled", sm: "striped"}}>
        <Hide below="md">
          <Thead>
            <Tr>
              <Td padding={tableCellPadding}>Product</Td>
              <Td padding={tableCellPadding}>Quantity</Td>
              <Td padding={tableCellPadding}>Refund Amount</Td>
              <Td padding={tableCellPadding}>Comments</Td>
            </Tr>
          </Thead>
        </Hide>
        <Tbody>
          {itemsToReturn.map((itemToReturn, index) => {
            const lineItem = lineItems.find((li) => li.ID === itemToReturn.LineItemID)
            return (
              <Tr key={index} as={isMobile && VStack} alignItems={{base: "flex-start", sm: "initial"}}>
                <Td padding={tableCellPadding}>
                  <Stack
                    direction={["row"]}
                    alignItems="center"
                    gap={4}
                    width={{base: "full", sm: "initial"}}
                    flex="1"
                    w="max-content"
                  >
                    <ProductDefaultImage boxSize={{base: 75, sm: 50}} product={lineItem.Product} />
                    <VStack justifyContent="space-between">
                      <Text fontSize={{base: "md", sm: "sm"}}>{lineItem.Product.Name}</Text>
                      <Link href={`/products/${lineItem.Product.ID}`}>
                        <Text fontSize="xs" color="gray.400">
                          SKU: {lineItem.Product.ID}
                        </Text>
                      </Link>
                    </VStack>
                  </Stack>
                </Td>
                <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                  <FormControl justifyContent="space-between">
                    <Hide above="md">
                      <FormLabel fontSize="sm">Quantity</FormLabel>
                    </Hide>
                    <Text>
                      {itemToReturn.Quantity} of {lineItem.Quantity}
                    </Text>
                  </FormControl>
                </Td>
                <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                  <FormControl justifyContent="space-between">
                    <Hide above="md">
                      <FormLabel fontSize="sm">Refund Amount</FormLabel>
                    </Hide>
                    <Text>
                      {priceHelper.formatShortPrice(itemToReturn.RefundAmount)} of{" "}
                      {priceHelper.formatShortPrice(lineItem.LineTotal)}
                    </Text>
                  </FormControl>
                </Td>
                <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                  <FormControl>
                    <Hide above="md">
                      <FormLabel fontSize="sm">Comments</FormLabel>
                    </Hide>
                    <Text>{itemToReturn.Comments}</Text>
                  </FormControl>
                  <Hide above="md">
                    <Divider mt={8} />
                  </Hide>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

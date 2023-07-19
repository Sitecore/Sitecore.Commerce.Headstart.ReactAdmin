import {InputControl, SelectControl} from "@/components/react-hook-form"
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
import {Control, FieldValues} from "react-hook-form"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {ProductThumbnail} from "../../order-products/ProductThumbnail"
import {Link} from "@/components/navigation/Link"
import {getMaxReturnQuantity} from "services/returns.service"

interface ReturnItemsTableProps {
  control: Control<FieldValues, any>
  lineItems: ILineItem[]
  allOrderReturns: IOrderReturn[]
  existingReturn: IOrderReturn
}

export function ReturnItemsTable({control, lineItems, allOrderReturns, existingReturn}: ReturnItemsTableProps) {
  const [isMobile] = useMediaQuery(`(max-width: ${theme.breakpoints["md"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  const buildQuantityOptions = (lineItem: ILineItem) => {
    const max = getMaxReturnQuantity(
      lineItem,
      allOrderReturns.filter((r) => r.ID !== existingReturn?.ID)
    )
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
    return [...numberArray, {label: "Do not return", value: ""}]
  }

  const tableCellPadding = 2

  return (
    // without overflow visible, the dropdown for Quantity may not show fully
    <TableContainer overflowX="visible" overflowY="visible" w="100%" maxW="container.xl">
      <Table variant={{base: "unstyled", sm: "simple"}}>
        <Hide below="md">
          <Thead>
            <Tr>
              <Td>Lineitem</Td>
              <Td>Quantity</Td>
              <Td>Refund Amount</Td>
              <Td>Comments</Td>
            </Tr>
          </Thead>
        </Hide>
        <Tbody>
          {lineItems.map((lineItem, index) => (
            <Tr key={lineItem.ID} as={isMobile && VStack} alignItems={{base: "flex-start", sm: "initial"}}>
              <Td padding={tableCellPadding}>
                <Stack
                  direction={["row"]}
                  alignItems="center"
                  gap={4}
                  width={{base: "full", sm: "initial"}}
                  flex="1"
                  w="max-content"
                >
                  <ProductThumbnail imageProps={{boxSize: {base: 75, sm: 50}}} product={lineItem.Product} />
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
                  <Hide above="sm">
                    <FormLabel fontSize="sm">Quantity</FormLabel>
                  </Hide>
                  <SelectControl
                    control={control}
                    name={`ItemsToReturn.${index}.Quantity`}
                    selectProps={{
                      options: buildQuantityOptions(lineItem)
                    }}
                  />
                </FormControl>
              </Td>
              <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                <FormControl justifyContent="space-between">
                  <Hide above="sm">
                    <FormLabel fontSize="sm">Refund Amount</FormLabel>
                  </Hide>
                  <InputControl
                    name={`ItemsToReturn.${index}.RefundAmount`}
                    control={control}
                    inputProps={{type: "number"}}
                    leftAddon="$"
                  />
                </FormControl>
              </Td>
              <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                <FormControl>
                  <Hide above="sm">
                    <FormLabel fontSize="sm">Comments</FormLabel>
                  </Hide>
                  <InputControl name={`ItemsToReturn.${index}.Comments`} control={control} />
                </FormControl>
                <Hide above="sm">
                  <Divider mt={8} />
                </Hide>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

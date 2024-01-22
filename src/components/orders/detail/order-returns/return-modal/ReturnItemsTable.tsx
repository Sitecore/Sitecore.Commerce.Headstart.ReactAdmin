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
import {Link} from "@chakra-ui/next-js"
import {getMaxReturnQuantity} from "services/returns.service"
import ProductDefaultImage from "@/components/shared/ProductDefaultImage"

interface ReturnItemsTableProps {
  control: Control<FieldValues, any>
  validationSchema: any
  lineItems: ILineItem[]
  allOrderReturns: IOrderReturn[]
  existingReturn: IOrderReturn
}

export function ReturnItemsTable({
  control,
  validationSchema,
  lineItems,
  allOrderReturns,
  existingReturn
}: ReturnItemsTableProps) {
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
              <Td padding={tableCellPadding}>Lineitem</Td>
              <Td padding={tableCellPadding}>Quantity</Td>
              <Td padding={tableCellPadding}>Refund Amount</Td>
              <Td padding={tableCellPadding}>Comments</Td>
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
                  <SelectControl
                    control={control}
                    validationSchema={validationSchema}
                    name={`ItemsToReturn.${index}.Quantity`}
                    selectProps={{
                      options: buildQuantityOptions(lineItem)
                    }}
                  />
                </FormControl>
              </Td>
              <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                <FormControl justifyContent="space-between">
                  <Hide above="md">
                    <FormLabel fontSize="sm">Refund Amount</FormLabel>
                  </Hide>
                  <InputControl
                    name={`ItemsToReturn.${index}.RefundAmount`}
                    control={control}
                    validationSchema={validationSchema}
                    inputProps={{type: "number"}}
                    leftAddon="$"
                  />
                </FormControl>
              </Td>
              <Td padding={tableCellPadding} w={{base: "100%", sm: "initial"}}>
                <FormControl>
                  <Hide above="md">
                    <FormLabel fontSize="sm">Comments</FormLabel>
                  </Hide>
                  <InputControl
                    name={`ItemsToReturn.${index}.Comments`}
                    control={control}
                    validationSchema={validationSchema}
                  />
                </FormControl>
                <Hide above="md">
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

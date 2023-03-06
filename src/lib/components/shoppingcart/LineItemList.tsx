import {FunctionComponent} from "react"
import LineItemCard from "./LineItemCard"
import {Table, Thead, Th, Tr, Tbody, Flex} from "@chakra-ui/react"
import {LineItem} from "ordercloud-javascript-sdk"

interface LineItemListProps {
  emptyMessage?: string
  editable?: boolean
  lineItems: LineItem[]
}

const LineItemList: FunctionComponent<LineItemListProps> = ({emptyMessage, editable, lineItems}) => {
  return lineItems && lineItems.length ? (
    <Flex as="section" gap={3} w="full" width="full">
      <Table>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Quantity</Th>
            <Th>Unit Price</Th>
            <Th>Total</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {lineItems.map((li) => (
            <LineItemCard lineItem={li} key={li.ID} />
          ))}
        </Tbody>
      </Table>
    </Flex>
  ) : (
    <h3>{emptyMessage}</h3>
  )
}

export default LineItemList

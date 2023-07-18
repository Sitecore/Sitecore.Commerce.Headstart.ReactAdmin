import {Text, Table, TableContainer, Thead, Th, Tr, Tbody, Td, Button} from "@chakra-ui/react"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {OrderStatus} from "../../OrderStatus"
import {priceHelper} from "utils"
import {Link} from "@/components/navigation/Link"

interface OrderReturnsProps {
  returns: IOrderReturn[]
}

export function OrderReturns({returns}: OrderReturnsProps) {
  if (!returns.length) {
    return <Text color="gray.400">This order has no returns</Text>
  }
  return (
    <TableContainer>
      <Table role="table">
        <Thead role="rowgroup">
          <Tr role="row">
            <Th role="columnheader">ID</Th>
            <Th role="columnheader">Status</Th>
            <Th role="columnheader">Refund Amount</Th>
          </Tr>
        </Thead>
        <Tbody role="rowgroup">
          {returns.map((orderReturn) => (
            <Tr key={orderReturn.ID} role="row">
              <Td role="cell">
                <Link href={`/returns/${orderReturn.ID}`}>{orderReturn.ID}</Link>
              </Td>
              <Td role="cell">
                <OrderStatus status={orderReturn.Status} />
              </Td>
              <Td role="cell">{priceHelper.formatPrice(orderReturn.RefundAmount)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

import {TableContainer, Table, Thead, Tr, Th, Tbody, Td} from "@chakra-ui/react"
import {Buyers, PromotionAssignment} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {IBuyer} from "types/ordercloud/IBuyer"
import {BuyerActionMenu} from "./BuyerActionMenu"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface BuyerTableProps {
  assignments: PromotionAssignment[]
  onRemove: (buyerId: string) => void
}

export function BuyerTable({assignments, onRemove}: BuyerTableProps) {
  const [buyers, setBuyers] = useState<IBuyer[]>([])

  useEffect(() => {
    async function buildBuyers() {
      const allBuyerIds = assignments.map((assignment) => assignment.BuyerID)
      const allBuyers = allBuyerIds.length ? (await Buyers.List({filters: {ID: allBuyerIds.join("|")}})).Items : []
      setBuyers(assignments.map((buyerAssignment) => allBuyers.find((c) => c.ID === buyerAssignment.BuyerID)))
    }

    buildBuyers()
  }, [assignments])

  return (
    <TableContainer
      whiteSpace="normal"
      border=".5px solid"
      borderColor="chakra-border-color"
      shadow="lg"
      overflowX="hidden"
      w="100%"
      minH={100}
      rounded="md"
      marginTop={6}
    >
      <Table role="table" w="100%" variant="striped">
        <Thead role="rowgroup">
          <Tr role="row">
            <Th role="columnheader">Name</Th>
            <Th role="columnheader">ID</Th>
          </Tr>
        </Thead>
        <Tbody role="rowgroup">
          {buyers.map((buyer, index) => {
            return (
              <Tr key={buyer.ID} role="row">
                <Td role="cell">{buyer.Name}</Td>
                <Td role="cell">{buyer.ID}</Td>
                <Td role="cell">
                  <ProtectedContent hasAccess={appPermissions.PromotionManager}>
                    <BuyerActionMenu onDeleteAssignment={() => onRemove(buyer.ID)} />
                  </ProtectedContent>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

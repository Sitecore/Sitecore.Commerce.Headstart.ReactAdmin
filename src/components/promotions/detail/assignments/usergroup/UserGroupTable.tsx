import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, Heading, Box} from "@chakra-ui/react"
import {Buyers, UserGroups, PromotionAssignment} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {IBuyer} from "types/ordercloud/IBuyer"
import {Dictionary, groupBy} from "lodash"
import {UserGroupActionMenu} from "./UserGroupActionMenu"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"

interface UserGroupTableProps {
  onRemove: (buyerId: string, userGroupId: string) => void
  usergroupAssignments: PromotionAssignment[]
}
export function UserGroupTable({usergroupAssignments, onRemove}: UserGroupTableProps) {
  const [assignments, setAssignments] = useState<Dictionary<{Buyer: IBuyer; UserGroup: IBuyerUserGroup}[]>>({})

  useEffect(() => {
    // build UserGroup and Buyer objects for display purposes
    async function buildDisplayValues() {
      const allBuyerIds = usergroupAssignments.map((assignment) => assignment.BuyerID)
      const allBuyers = allBuyerIds.length ? (await Buyers.List({filters: {ID: allBuyerIds.join("|")}})).Items : []
      const requests = usergroupAssignments.map(async (buyerAssignment) => {
        const buyer = allBuyers.find((c) => c.ID === buyerAssignment.BuyerID)
        const usergroup = await UserGroups.Get(buyerAssignment.BuyerID, buyerAssignment.UserGroupID)
        return {
          Buyer: buyer,
          UserGroup: usergroup
        }
      })
      const results = await Promise.all(requests)
      const groupedResults = groupBy(results, (assignment) => assignment.Buyer.ID)
      setAssignments(groupedResults)
    }

    buildDisplayValues()
  }, [usergroupAssignments])

  return (
    <>
      {Object.entries(assignments).map(([buyerId, buyerAssignments]) => {
        const buyer = buyerAssignments[0].Buyer
        return (
          <Box key={buyerId} width="full" marginTop={6}>
            <Heading size="sm" marginBottom={3}>
              {buyer.Name}
            </Heading>
            <TableContainer
              whiteSpace="normal"
              border=".5px solid"
              borderColor="chakra-border-color"
              shadow="lg"
              overflowX="hidden"
              w="100%"
              minH={100}
              key={buyerId}
              marginBottom={5}
            >
              <Table role="table" w="100%" variant="striped">
                <Thead>
                  <Tr role="row">
                    <Th role="columnheader">Name</Th>
                    <Th role="columnheader">ID</Th>
                    <Th role="columnheader">Description</Th>
                    <Th role="columnheader"></Th>
                  </Tr>
                </Thead>
                <Tbody role="rowgroup">
                  {buyerAssignments.map((assignment) => {
                    const usergroup = assignment.UserGroup
                    return (
                      <Tr role="row" key={buyerId + usergroup.ID}>
                        <Td role="cell">{usergroup.Name}</Td>
                        <Td role="cell">{usergroup.ID}</Td>
                        <Td role="cell">{usergroup.Description}</Td>
                        <Td role="cell">
                          <ProtectedContent hasAccess={appPermissions.PromotionManager}>
                            <UserGroupActionMenu onDeleteAssignment={() => onRemove(buyerId, usergroup.ID)} />
                          </ProtectedContent>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )
      })}
    </>
  )
}

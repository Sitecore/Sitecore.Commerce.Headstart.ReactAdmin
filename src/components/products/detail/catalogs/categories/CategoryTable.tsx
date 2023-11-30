import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, Heading, Box} from "@chakra-ui/react"
import {Catalogs, Categories} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {ICatalog} from "types/ordercloud/ICatalog"
import {ICategory} from "types/ordercloud/ICategoryXp"
import {Dictionary, groupBy} from "lodash"
import {CategoryActionMenu} from "./CategoryActionMenu"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface CategoryTableProps {
  onRemove: (index: number) => void
  categoryAssignments: ICategoryProductAssignment[]
}
export function CategoryTable({categoryAssignments, onRemove}: CategoryTableProps) {
  const [assignments, setAssignments] = useState<Dictionary<{Catalog: ICatalog; Category: ICategory}[]>>({})

  useEffect(() => {
    // build Category and Catalog objects for display purposes
    async function buildDisplayValues() {
      const allCatalogIds = categoryAssignments.map((assignment) => assignment.CatalogID)
      const allCatalogs = allCatalogIds.length
        ? (await Catalogs.List({filters: {ID: allCatalogIds.join("|")}})).Items
        : []
      const requests = categoryAssignments.map(async (catalogAssignment) => {
        const catalog = allCatalogs.find((c) => c.ID === catalogAssignment.CatalogID)
        const category = await Categories.Get(catalogAssignment.CatalogID, catalogAssignment.CategoryID)
        return {
          Catalog: catalog,
          Category: category
        }
      })
      const results = await Promise.all(requests)
      const groupedResults = groupBy(results, (assignment) => assignment.Catalog.ID)
      setAssignments(groupedResults)
    }

    buildDisplayValues()
  }, [categoryAssignments])

  return (
    <>
      {Object.entries(assignments).map(([catalogId, catalogAssignments]) => {
        const catalog = catalogAssignments[0].Catalog
        return (
          <Box key={catalogId}>
            <Heading size="sm" marginBottom={3}>
              {catalog.Name}
            </Heading>
            <TableContainer
              whiteSpace="normal"
              border=".5px solid"
              borderColor="chakra-border-color"
              shadow="lg"
              overflowX="hidden"
              w="100%"
              minH={100}
              key={catalogId}
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
                  {catalogAssignments.map((assignment, index) => {
                    const category = assignment.Category
                    return (
                      <Tr role="row" key={catalogId + category.ID}>
                        <Td role="cell">{category.Name}</Td>
                        <Td role="cell">{category.ID}</Td>
                        <Td role="cell">{category.Description}</Td>
                        <Td role="cell">
                          <ProtectedContent hasAccess={appPermissions.ProductManager}>
                            <CategoryActionMenu onDeleteAssignment={() => onRemove(index)} />
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

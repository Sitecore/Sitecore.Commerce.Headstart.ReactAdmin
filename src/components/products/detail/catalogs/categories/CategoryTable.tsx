import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, Heading, Box} from "@chakra-ui/react"
import {Catalogs, Categories} from "ordercloud-javascript-sdk"
import {Control, UseFieldArrayReturn, useWatch} from "react-hook-form"
import {useEffect, useState} from "react"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {ICatalog} from "types/ordercloud/ICatalog"
import {ICategory} from "types/ordercloud/ICategoryXp"
import {Dictionary, groupBy} from "lodash"
import {CategoryActionMenu} from "./CategoryActionMenu"
import {ProductDetailFormFields} from "../../form-meta"

interface CategoryTableProps {
  control: Control<ProductDetailFormFields>
  fieldArray: UseFieldArrayReturn<ProductDetailFormFields, "CategoryAssignments", "id">
}
export function CategoryTable({control, fieldArray}: CategoryTableProps) {
  const {remove} = fieldArray
  const [assignments, setAssignments] = useState<Dictionary<{Catalog: ICatalog; Category: ICategory}[]>>({})
  const watchedFields = useWatch({control, name: "CategoryAssignments"}) as ICategoryProductAssignment[]

  useEffect(() => {
    // build Category and Catalog objects for display purposes
    async function buildDisplayValues() {
      const allCatalogIds = watchedFields.map((assignment) => assignment.CatalogID)
      const allCatalogs = allCatalogIds.length
        ? (await Catalogs.List({filters: {ID: allCatalogIds.join("|")}})).Items
        : []
      const requests = watchedFields.map(async (catalogAssignment) => {
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
  }, [watchedFields])

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
              borderColor="st.borderColor"
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
                          <CategoryActionMenu onDeleteAssignment={() => remove(index)} />
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

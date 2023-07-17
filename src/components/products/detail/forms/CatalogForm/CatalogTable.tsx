import {TableContainer, Table, Thead, Tr, Th, Tbody, Td, Text} from "@chakra-ui/react"
import {Catalogs, ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {Control, FieldValues, UseFieldArrayReturn, useWatch} from "react-hook-form"
import {useEffect, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import {CatalogActionMenu} from "./CatalogActionMenu"

interface CatalogsTableProps {
  control: Control<FieldValues, any>
  fieldArray: UseFieldArrayReturn<FieldValues, "CatalogAssignments", "id">
}

export function CatalogsTable({control, fieldArray}: CatalogsTableProps) {
  const {remove} = fieldArray
  const [catalogs, setCatalogs] = useState<ICatalog[]>([])
  const watchedFields = useWatch({control, name: "CatalogAssignments"}) as ProductCatalogAssignment[]

  useEffect(() => {
    async function buildCatalogs() {
      const allCatalogIds = watchedFields.map((assignment) => assignment.CatalogID)
      const allCatalogs = allCatalogIds.length
        ? (await Catalogs.List({filters: {ID: allCatalogIds.join("|")}})).Items
        : []
      setCatalogs(
        watchedFields.map((catalogAssignment) => allCatalogs.find((c) => c.ID === catalogAssignment.CatalogID))
      )
    }

    buildCatalogs()
  }, [watchedFields])

  return (
    <TableContainer
      whiteSpace="normal"
      border=".5px solid"
      borderColor="st.borderColor"
      shadow="lg"
      overflowX="hidden"
      w="100%"
      minH={100}
      rounded="md"
    >
      <Table role="table" w="100%" variant="striped">
        <Thead role="rowgroup">
          <Tr role="row">
            <Th role="columnheader">Name</Th>
            <Th role="columnheader">ID</Th>
            <Th role="columnheader">Description</Th>
            <Th role="columnheader">Category Count</Th>
          </Tr>
        </Thead>
        <Tbody role="rowgroup">
          {catalogs.map((catalog, index) => {
            return (
              <Tr key={catalog.ID} role="row">
                <Td role="cell">{catalog.Name}</Td>
                <Td role="cell">{catalog.ID}</Td>
                <Td role="cell">
                  <Text noOfLines={2} maxWidth="400px">
                    {catalog.Description}
                  </Text>
                </Td>
                <Td role="cell">{catalog.CategoryCount}</Td>
                <Td role="cell">
                  <CatalogActionMenu onDeleteAssignment={() => remove(index)} />
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

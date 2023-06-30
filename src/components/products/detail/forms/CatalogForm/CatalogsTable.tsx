import ProductActionMenu from "@/components/products/list/ProductActionMenu"
import {EditIcon, DeleteIcon} from "@chakra-ui/icons"
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  ButtonGroup,
  Text
} from "@chakra-ui/react"
import {Buyers, Catalogs, UserGroups} from "ordercloud-javascript-sdk"
import {Control, FieldValues, UseFieldArrayReturn, useWatch} from "react-hook-form"
import {TbDotsVertical} from "react-icons/tb"
import {priceHelper} from "utils"
import {useEffect, useState} from "react"
import {ProductCatalogAssignmentFieldValues} from "types/form/ProductCatalogAssignmentFieldValues"

interface CatalogsTableProps {
  control: Control<FieldValues, any>
  fieldArray: UseFieldArrayReturn<FieldValues, "CatalogAssignments", "id">
}

export function CatalogsTable({control, fieldArray}: CatalogsTableProps) {
  const {remove, update, append} = fieldArray
  const [catalogAssignments, setOverrideCatalogsAssignments] = useState<ProductCatalogAssignmentFieldValues[]>([])
  const watchedFields = useWatch({control, name: "CatalogAssignments"})

  useEffect(() => {
    // adds display names (BuyerName and UserGroupName) to assignments
    async function buildOverrideCatalogsAssignments() {
      const requests = (watchedFields as ProductCatalogAssignmentFieldValues[]).map(async (catalogAssignment) => {
        const catalog = catalogAssignment.CatalogID ? await Catalogs.Get(catalogAssignment.CatalogID) : null
          return {
            ...catalogAssignment,
            CatalogName: catalog?.Name
          }
      })
      const responses = await Promise.all(requests)
      setOverrideCatalogsAssignments(responses)
    }

    buildOverrideCatalogsAssignments()
  }, [watchedFields])

  const getAssignedToDescription = (assignments: ProductCatalogAssignmentFieldValues[]) => {
    return (
      <>
        {assignments.length > 0 && (
          <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
            {assignments.map((assignment, index) => (
              <Button
                key={index}
                variant="solid"
                fontWeight={"normal"}
                size="sm"
                borderRadius={"full"}
                backgroundColor="primary.100"
                margin={0}
                cursor="default"
                _hover={{backgroundColor: "primary.100"}}
              >
                {assignment.CatalogName}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </>
    )
  }

  return (
    <TableContainer whiteSpace="pre-wrap" maxWidth="fit-content">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Assigned To</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
            <Tr>
                <Td>{getAssignedToDescription(catalogAssignments)}</Td>
                {/* <Td>
                  <PriceOverridesActionMenu
                    priceSchedule={overrideCatalogsAssignment}
                    onUpdate={(newCatalogsAssignment) => update(index, newCatalogsAssignment)}
                    onDelete={() => remove(index)}
                  />
                </Td> */}
            </Tr>
        </Tbody>
      </Table>
      {/* <PriceOverrideModal
        step="editprice"
        onUpdate={append}
        as="button"
        buttonProps={{variant: "link", color: "accent.400", marginTop: 3}}
      /> */}
    </TableContainer>
  )
}
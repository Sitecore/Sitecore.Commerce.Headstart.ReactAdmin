import {EditIcon} from "@chakra-ui/icons"
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
  MenuList,
  Button,
  ButtonGroup} from "@chakra-ui/react"
import {Catalogs} from "ordercloud-javascript-sdk"
import {Control, FieldValues, UseFieldArrayReturn, useWatch} from "react-hook-form"
import {TbDotsVertical} from "react-icons/tb"
import {useEffect, useState} from "react"
import {ProductCatalogAssignmentFieldValues} from "types/form/ProductCatalogAssignmentFieldValues"
import CatalogAssignmentModal from "./catalog-assignment-modal/CatalogAssignmentModal"

interface CatalogsTableProps {
  control: Control<FieldValues, any>
  fieldArray: UseFieldArrayReturn<FieldValues, "CatalogAssignments", "id">
  product?: string
}

export function CatalogsTable({control, fieldArray, product}: CatalogsTableProps) {
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
                {<Td>
                  {<CatalogsActionMenu
                    catalogs={catalogAssignments}
                    product={product}
                    onUpdate={append}
                    onRemove={remove}
                  />}
                </Td>}
            </Tr>
        </Tbody>
      </Table>
      <CatalogAssignmentModal
        onUpdate={append}
        onRemove={remove}
        catalogs={catalogAssignments}
        product={product}
        as="button"
        buttonProps={{variant: "link", color: "accent.400", marginTop: 3}}
      />
    </TableContainer>
  )
}

interface CatalogsActionMenuProps {
  catalogs: ProductCatalogAssignmentFieldValues[]
  onUpdate: (newCatalog: ProductCatalogAssignmentFieldValues[]) => void
  onRemove: (index: number) => void
  product?: string
}

function CatalogsActionMenu({catalogs, onUpdate, onRemove, product}: CatalogsActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`Catalog Assignment action menu`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="blackAlpha.400" />
      </MenuButton>
      <MenuList>
        <CatalogAssignmentModal
          catalogs={catalogs}
          onUpdate={onUpdate}
          onRemove={onRemove}
          product={product}
          as="menuitem"
          menuItemProps={{
            justifyContent: "space-between",
            children: (
              <>
                Edit Assignments <EditIcon />
              </>
            )
          }}
        />
      </MenuList>
    </Menu>
  )
}
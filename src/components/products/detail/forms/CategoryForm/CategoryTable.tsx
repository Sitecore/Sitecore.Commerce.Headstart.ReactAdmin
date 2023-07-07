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
  ButtonGroup,
  Text
} from "@chakra-ui/react"
import {Catalogs, Categories} from "ordercloud-javascript-sdk"
import {Control, FieldValues, UseFieldArrayReturn, useWatch} from "react-hook-form"
import {TbDotsVertical} from "react-icons/tb"
import {useEffect, useState} from "react"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {CategoryAssignmentModal} from "./category-assignment-modal/CategoryAssignmentModal"

type EnhancedCategoryProductAssignment = ICategoryProductAssignment & {CatalogName: string; CategoryName: string}

interface CategoryTableProps {
  control: Control<FieldValues, any>
  fieldArray: UseFieldArrayReturn<FieldValues, any>
}
export function CategoryTable({control, fieldArray}: CategoryTableProps) {
  const {replace} = fieldArray
  const [enhancedCategoryAssignments, setEnhancedCategoryAssignments] = useState<EnhancedCategoryProductAssignment[]>(
    []
  )
  const watchedFields = useWatch({control, name: "CategoryAssignments"}) as ICategoryProductAssignment[]

  useEffect(() => {
    // adds display names (CatalogName and CategoryName) to assignments
    async function buildDisplayValues() {
      const allCatalogIds = watchedFields.map((assignment) => assignment.CatalogID)
      const allCatalogs = allCatalogIds.length
        ? (await Catalogs.List({filters: {ID: allCatalogIds.join("|")}})).Items
        : []
      const requests = watchedFields.map(async (catalogAssignment) => {
        const catalog = allCatalogs.find((c) => c.ID === catalogAssignment.CatalogID)
        const category = await Categories.Get(catalogAssignment.CatalogID, catalogAssignment.CategoryID)
        return {
          ...catalogAssignment,
          CatalogName: catalog?.Name,
          CategoryName: category.Name
        }
      })
      const responses = await Promise.all(requests)
      setEnhancedCategoryAssignments(responses)
    }

    buildDisplayValues()
  }, [watchedFields])

  const getAssignmentsDisplay = (assignments: EnhancedCategoryProductAssignment[]) => {
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
                backgroundColor="accent.100"
                margin={0}
                cursor="default"
                _hover={{backgroundColor: "accent.100"}}
              >
                {assignment.CatalogName} <Text marginX={3}>|</Text> {assignment.CategoryName}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </>
    )
  }

  return (
    <TableContainer whiteSpace="pre-wrap" maxWidth="fit-content" minWidth="350px">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Assigned To</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{getAssignmentsDisplay(enhancedCategoryAssignments)}</Td>
            <Td>
              <CategoryActionMenu categoryAssignments={enhancedCategoryAssignments} onUpdate={replace} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}

interface CategoryActionMenuProps {
  categoryAssignments: ICategoryProductAssignment[]
  onUpdate: (newAssignment: ICategoryProductAssignment[]) => void
}

function CategoryActionMenu({categoryAssignments, onUpdate}: CategoryActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`Catalog Assignment action menu`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="blackAlpha.400" />
      </MenuButton>
      <MenuList>
        <CategoryAssignmentModal
          categoryAssignments={categoryAssignments}
          onUpdate={onUpdate}
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

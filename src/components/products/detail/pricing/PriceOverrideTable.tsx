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
import {Buyers, UserGroups} from "ordercloud-javascript-sdk"
import {Control, UseFieldArrayReturn, useWatch} from "react-hook-form"
import {TbDotsVertical} from "react-icons/tb"
import {priceHelper} from "utils"
import {PriceOverrideModal} from "./price-override-modal/PriceOverrideModal"
import {useEffect, useState} from "react"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import {ProductDetailFormFields} from "../form-meta"

interface PriceOverrideTableProps {
  control: Control<ProductDetailFormFields>
  fieldArray: UseFieldArrayReturn<ProductDetailFormFields, "OverridePriceSchedules", "id">
}

export function PriceOverrideTable({control, fieldArray}: PriceOverrideTableProps) {
  const {remove, update, append} = fieldArray
  const [overridePriceSchedules, setOverridePriceSchedules] = useState<OverridePriceScheduleFieldValues[]>([])
  const watchedFields = useWatch({control, name: "OverridePriceSchedules"})

  useEffect(() => {
    // adds display names (BuyerName and UserGroupName) to assignments
    async function buildOverridePriceSchedules() {
      const requests = (watchedFields as OverridePriceScheduleFieldValues[]).map(async (overridePriceSchedule) => {
        const enhancedAssignments = overridePriceSchedule.ProductAssignments.map(async (assignment) => {
          const buyer = assignment.BuyerID ? await Buyers.Get(assignment.BuyerID) : null
          const userGroup = assignment.UserGroupID
            ? await UserGroups.Get(assignment.BuyerID, assignment.UserGroupID)
            : null
          return {
            ...assignment,
            BuyerName: buyer?.Name,
            UserGroupName: userGroup?.Name
          }
        })
        overridePriceSchedule.ProductAssignments = await Promise.all(enhancedAssignments)
        return overridePriceSchedule
      })
      const responses = await Promise.all(requests)
      setOverridePriceSchedules(responses)
    }

    buildOverridePriceSchedules()
  }, [watchedFields])

  const getAssignedToDescription = (assignments: OverridePriceScheduleFieldValues["ProductAssignments"]) => {
    const buyerLevelAssignments = assignments.filter((assignment) => assignment.BuyerID && !assignment.UserGroupID)
    const userGroupLevelAssignments = assignments.filter((assignment) => assignment.BuyerID && assignment.UserGroupID)

    if (buyerLevelAssignments.length > 5 || userGroupLevelAssignments.length > 3) {
      let result = ""

      // if there are many assignments just show a count
      if (buyerLevelAssignments.length) {
        result += `${buyerLevelAssignments.length} buyer${buyerLevelAssignments.length > 1 ? "s" : ""}`
      }
      if (userGroupLevelAssignments.length) {
        if (buyerLevelAssignments.length) {
          result += ", and "
        }
        result += `${userGroupLevelAssignments.length} usergroup${userGroupLevelAssignments.length > 1 ? "s" : ""}`
      }
      return result
    }

    return (
      <>
        {buyerLevelAssignments.length > 0 && (
          <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
            {buyerLevelAssignments.map((assignment, index) => (
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
                {assignment.BuyerName}
              </Button>
            ))}
          </ButtonGroup>
        )}
        {userGroupLevelAssignments.length > 0 && (
          <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
            {userGroupLevelAssignments.map((assignment, index) => (
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
                {assignment.BuyerName} <Text marginX={3}>|</Text> {assignment.UserGroupName}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </>
    )
  }

  const getPricingDescription = (priceSchedule: OverridePriceScheduleFieldValues) => {
    if (!priceSchedule.PriceBreaks?.length) {
      return "No pricing"
    }
    if (priceSchedule.PriceBreaks.length === 1) {
      return priceHelper.formatPrice(priceSchedule.PriceBreaks[0].Price)
    }
    return priceSchedule.PriceBreaks.map((priceBreak) => {
      return `>${priceBreak.Quantity} for ${priceHelper.formatPrice(priceBreak.Price)}`
    }).join("\n")
  }

  return (
    <TableContainer whiteSpace="pre-wrap" maxWidth="fit-content">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Assigned To</Th>
            <Th>Pricing</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {overridePriceSchedules.map((overridePriceSchedule, index: number) => {
            return (
              <Tr key={overridePriceSchedule.ID || overridePriceSchedule.id}>
                <Td>{getAssignedToDescription(overridePriceSchedule.ProductAssignments)}</Td>
                <Td>{getPricingDescription(overridePriceSchedule)}</Td>
                <Td>
                  <PriceOverridesActionMenu
                    priceSchedule={overridePriceSchedule}
                    onUpdate={(newPriceSchedule) => update(index, newPriceSchedule)}
                    onDelete={() => remove(index)}
                  />
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <PriceOverrideModal
        step="editprice"
        onUpdate={append}
        as="button"
        buttonProps={{variant: "link", color: "accent.400", marginTop: 3}}
      />
    </TableContainer>
  )
}

interface PriceOverridesActionMenuProps {
  priceSchedule: OverridePriceScheduleFieldValues
  onDelete: () => void
  onUpdate: (newPriceSchedule: OverridePriceScheduleFieldValues) => void
}

function PriceOverridesActionMenu({priceSchedule, onDelete, onUpdate}: PriceOverridesActionMenuProps) {
  return (
    <Menu>
      <MenuButton as={IconButton} aria-label={`Price override action menu for ${priceSchedule.id}`} variant="ghost">
        <Icon as={TbDotsVertical} mt={1} color="blackAlpha.400" />
      </MenuButton>
      <MenuList>
        <PriceOverrideModal
          step="editprice"
          priceSchedule={priceSchedule}
          onUpdate={onUpdate}
          as="menuitem"
          menuItemProps={{
            justifyContent: "space-between",
            children: (
              <>
                Edit Price <EditIcon />
              </>
            )
          }}
        />
        <PriceOverrideModal
          step="assignprice"
          priceSchedule={priceSchedule}
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
        <MenuDivider />
        <MenuItem justifyContent="space-between" color="danger" onClick={onDelete}>
          Delete <DeleteIcon />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

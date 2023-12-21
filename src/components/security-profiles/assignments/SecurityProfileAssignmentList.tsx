import {Link} from "@chakra-ui/next-js"
import {
  HStack,
  VStack,
  Text,
  Checkbox,
  Card,
  CardBody,
  MenuItem,
  Menu,
  MenuButton,
  MenuList,
  Link as ChakraLink
} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import useAwaitableModals from "hooks/useAwaitableModals"
import {isAllowedAccess} from "hooks/useHasAccess"
import {useSecurityProfileAssignmentRows} from "hooks/useSecurityProfileAssignmentRows"
import {SecurityProfileAssignment} from "ordercloud-javascript-sdk"
import {ReactNode} from "react"
import {FaCaretRight} from "react-icons/fa"
import {SecurityProfileAssignmentLevel} from "types/ordercloud/SecurityProfileAssignmentLevel"

export const PLACEHOLDER_ID = "THIS_WILL_BE_REPLACED_BY_THE_CREATED_ENTITY_ID"

interface SecurityProfileAssignmentListProps {
  assignments: SecurityProfileAssignment[]
  onAssignmentsChange: (assignments: SecurityProfileAssignment[]) => void
  assignmentLevel: SecurityProfileAssignmentLevel
  commerceRole: "buyer" | "supplier" | "admin"
  parentId?: string
  assignmentLevelId: string
}

export function SecurityProfileAssignmentList({
  assignments,
  onAssignmentsChange,
  assignmentLevel,
  commerceRole,
  parentId,
  assignmentLevelId = PLACEHOLDER_ID
}: SecurityProfileAssignmentListProps) {
  const features = Object.values(appPermissions)
  const {rows} = useSecurityProfileAssignmentRows({assignments, assignmentLevel, commerceRole})
  const {confirm} = useAwaitableModals()

  const handleAssignmentChange = async (shouldAssign: boolean, isInherited: boolean, securityProfileId: string) => {
    if (shouldAssign && isInherited) {
      const confirmText =
        "This security profile is already assigned to a parent, and inherited. Do you still want to make the assignment?"
      if (!(await confirm(confirmText))) {
        return
      }
    }

    const targetAssignment: SecurityProfileAssignment = {
      SecurityProfileID: securityProfileId,
      BuyerID: null,
      SupplierID: null,
      UserGroupID: null,
      UserID: null
    }
    if (assignmentLevel === "company" || parentId) {
      if (commerceRole === "buyer") {
        targetAssignment.BuyerID = parentId || assignmentLevelId
      } else if (commerceRole === "supplier") {
        targetAssignment.SupplierID = parentId || assignmentLevelId
      }
    }
    if (assignmentLevel === "user") {
      targetAssignment.UserID = assignmentLevelId
    } else if (assignmentLevel === "group") {
      targetAssignment.UserGroupID = assignmentLevelId
    }

    if (shouldAssign) {
      const updatedAssignments = [...assignments, targetAssignment]
      onAssignmentsChange(updatedAssignments)
    } else {
      const updatedAssignments = assignments.filter((a) => {
        const match =
          a.SecurityProfileID === securityProfileId &&
          a.BuyerID === targetAssignment.BuyerID &&
          a.SupplierID === targetAssignment.SupplierID &&
          a.UserID === targetAssignment.UserID &&
          a.UserGroupID === targetAssignment.UserGroupID

        return !match
      })
      onAssignmentsChange(updatedAssignments)
    }
  }

  if (!rows?.length) {
    return
  }
  return (
    <VStack>
      {rows.map(({securityProfile, isInherited, isAssignedAtCurrentLevel, inheritedAssignedParties}) => {
        const roles = [...securityProfile.Roles, ...securityProfile.CustomRoles]
        const enabledFeaturesCount = features.filter((f) => isAllowedAccess(roles, f, commerceRole === "admin")).length

        const summary: string[] = []
        if (enabledFeaturesCount) {
          summary.push(`${enabledFeaturesCount} features`)
        }
        if (securityProfile.Roles.length) {
          summary.push(`${securityProfile.Roles.length} roles`)
        }
        if (securityProfile.CustomRoles.length) {
          summary.push(`${securityProfile.CustomRoles.length} custom roles`)
        }

        const inheritedFromParts: ReactNode[] = []
        if (isInherited) {
          if (inheritedAssignedParties.buyer) {
            const buyer = inheritedAssignedParties.buyer
            inheritedFromParts.push(
              <Link href={`/buyers/${buyer.ID}`} key="company">
                company
              </Link>
            )
          }
          if (inheritedAssignedParties.supplier) {
            const supplier = inheritedAssignedParties.supplier
            inheritedFromParts.push(
              <Link href={`/suppliers/${supplier.ID}`} key="company">
                company
              </Link>
            )
          }
          if (inheritedAssignedParties.admin) {
            inheritedFromParts.push(
              <Link href={`/settings/securityprofiles/${securityProfile.ID}`} key="company">
                company
              </Link>
            )
          }
          if (inheritedAssignedParties.buyerUserGroups?.length) {
            if (inheritedAssignedParties.buyerUserGroups.length > 1) {
              inheritedFromParts.push(
                <Menu>
                  <MenuButton as={ChakraLink}>{inheritedAssignedParties.buyerUserGroups.length} groups</MenuButton>
                  <MenuList>
                    {inheritedAssignedParties.buyerUserGroups.map(({userGroup, buyerID}) => (
                      <MenuItem
                        key={userGroup.ID}
                        as={Link}
                        href={`/buyers/${buyerID}/usergroups/${userGroup.ID}`}
                        flexDirection="row-reverse"
                        icon={<FaCaretRight />}
                      >
                        {userGroup.Name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )
            } else {
              const item = inheritedAssignedParties.buyerUserGroups[0]
              inheritedFromParts.push(
                <Link
                  key="usergroups"
                  href={`/buyers/${item.buyerID}/usergroups/${item.userGroup.ID}`}
                  title={item.userGroup.Name}
                >
                  group
                </Link>
              )
            }
          }
          if (inheritedAssignedParties.supplierUserGroups?.length) {
            if (inheritedAssignedParties.supplierUserGroups.length > 1) {
              inheritedFromParts.push(
                <Menu>
                  <MenuButton as={ChakraLink}>{inheritedAssignedParties.supplierUserGroups.length} groups</MenuButton>
                  <MenuList>
                    {inheritedAssignedParties.supplierUserGroups.map(({userGroup, supplierID}) => (
                      <MenuItem
                        key={userGroup.ID}
                        as={Link}
                        href={`/suppliers/${supplierID}/usergroups/${userGroup.ID}`}
                        flexDirection="row-reverse"
                        icon={<FaCaretRight />}
                      >
                        {userGroup.Name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )
            } else {
              const item = inheritedAssignedParties.supplierUserGroups[0]
              inheritedFromParts.push(
                <Link
                  key="usergroups"
                  href={`/suppliers/${item.supplierID}/usergroups/${item.userGroup.ID}`}
                  title={item.userGroup.Name}
                >
                  group
                </Link>
              )
            }
          }
          if (inheritedAssignedParties.adminUserGroups?.length) {
            if (inheritedAssignedParties.adminUserGroups.length > 1) {
              inheritedFromParts.push(
                <Menu>
                  <MenuButton as={ChakraLink}>{inheritedAssignedParties.adminUserGroups.length} groups</MenuButton>
                  <MenuList>
                    {inheritedAssignedParties.adminUserGroups.map((group) => (
                      <MenuItem
                        key={group.ID}
                        as={Link}
                        href={`/settings/adminusergroups/${group.ID}`}
                        flexDirection="row-reverse"
                        icon={<FaCaretRight />}
                      >
                        {group.Name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )
            } else {
              const item = inheritedAssignedParties.adminUserGroups[0]
              inheritedFromParts.push(
                <Link key="usergroups" href={`/settings/adminusergroups/${item.ID}`} title={item.Name}>
                  group
                </Link>
              )
            }
          }
        }

        return (
          <Card key={securityProfile.ID} width="full" marginBottom={3}>
            <CardBody as={HStack} alignItems="center" gap={6}>
              <Checkbox
                isChecked={isAssignedAtCurrentLevel}
                onChange={(e) => handleAssignmentChange(e.target.checked, isInherited, securityProfile.ID)}
              />
              <VStack alignItems="flex-start" justifyContent="center" lineHeight="1">
                <Link href={`/settings/securityprofiles/${securityProfile.ID}`} title={securityProfile.Name}>
                  {securityProfile.Name}
                </Link>
                <Text color="chakra-subtle-text" fontSize="sm">
                  {summary.join(", ")}
                </Text>
              </VStack>
              {isInherited && (
                <VStack
                  fontSize="xs"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  ml="auto"
                  lineHeight="1"
                  maxW="200"
                >
                  <Text color="chakra-placeholder-color">Inherited from</Text>
                  <HStack
                    flexWrap="wrap"
                    alignItems="flex-end"
                    divider={
                      <Text color="chakra-placeholder-color" mr={1}>
                        ,
                      </Text>
                    }
                  >
                    {inheritedFromParts}
                  </HStack>
                </VStack>
              )}
            </CardBody>
          </Card>
        )
      })}
    </VStack>
  )
}

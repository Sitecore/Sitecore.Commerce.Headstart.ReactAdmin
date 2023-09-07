import {Link} from "@/components/navigation/Link"
import {HStack, VStack, Text, Checkbox, Card, CardBody, Heading} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import {isAllowedAccess} from "hooks/useHasAccess"
import {useSecurityProfileAssignmentRows} from "hooks/useSecurityProfileAssignmentRows"
import {SecurityProfileAssignment} from "ordercloud-javascript-sdk"
import {ReactNode} from "react"
import {useController} from "react-hook-form"
import {SecurityProfileAssignmentLevel} from "types/ordercloud/SecurityProfileAssignmentLevel"

interface SecurityProfileAssignmentListProps {
  assignmentLevel: SecurityProfileAssignmentLevel
  commerceRole: "buyer" | "supplier" | "admin"
  parentId: string
  assignmentLevelId: string
  control: any
}

export function SecurityProfileAssignmentList({
  assignmentLevel,
  commerceRole,
  parentId,
  assignmentLevelId,
  control
}: SecurityProfileAssignmentListProps) {
  const features = Object.values(appPermissions)
  const {
    field: {value: assignments, onChange: onAssignmentsChange}
  } = useController({control, name: "SecurityProfileAssignments"})
  const {rows} = useSecurityProfileAssignmentRows({assignments, assignmentLevel, commerceRole})

  const handleAssignmentChange = (shouldAssign: boolean, securityProfileId: string) => {
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
      {rows.map(({securityProfile, isInherited, isAssigned, inheritedAssignedParties}) => {
        const roles = [...securityProfile.Roles, ...securityProfile.CustomRoles]
        const enabledFeaturesCount = features.filter((f) => isAllowedAccess(roles, f)).length

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
                <Text key="usergroups">{inheritedAssignedParties.buyerUserGroups.length} usergroups</Text>
              )
            } else {
              const item = inheritedAssignedParties.buyerUserGroups[0]
              inheritedFromParts.push(
                <Link
                  key="usergroups"
                  href={`/buyers/${item.buyerID}/usergroups/${item.userGroup.ID}`}
                  title={item.userGroup.Name}
                >
                  usergroup
                </Link>
              )
            }
          }
          if (inheritedAssignedParties.supplierUserGroups?.length) {
            if (inheritedAssignedParties.supplierUserGroups.length > 1) {
              inheritedFromParts.push(<Text>{inheritedAssignedParties.supplierUserGroups.length} usergroups</Text>)
            } else {
              const item = inheritedAssignedParties.supplierUserGroups[0]
              inheritedFromParts.push(
                <Link
                  key="usergroups"
                  href={`/suppliers/${item.supplierID}/usergroups/${item.userGroup.ID}`}
                  title={item.userGroup.Name}
                >
                  usergroup
                </Link>
              )
            }
          }
          if (inheritedAssignedParties.adminUserGroups?.length) {
            if (inheritedAssignedParties.adminUserGroups.length > 1) {
              inheritedFromParts.push(<Text>{inheritedAssignedParties.adminUserGroups.length} usergroups</Text>)
            } else {
              const item = inheritedAssignedParties.adminUserGroups[0]
              inheritedFromParts.push(
                <Link key="usergroups" href={`/settings/adminusergroups/${item.ID}`} title={item.Name}>
                  usergroup
                </Link>
              )
            }
          }
        }

        return (
          <Card key={securityProfile.ID + isInherited} width="full" marginBottom={3}>
            <CardBody as={HStack} alignItems="center" gap={6}>
              <Checkbox
                isChecked={isAssigned}
                isDisabled={isInherited}
                onChange={(e) => handleAssignmentChange(e.target.checked, securityProfile.ID)}
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
                    gap={2}
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

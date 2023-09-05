import {useCallback, useEffect, useState} from "react"
import {UserGroupFormForm} from "../../../../components/usergroups/UserGroupForm"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {SecurityProfileAssignment, SecurityProfiles, SupplierUserGroups, UserGroup} from "ordercloud-javascript-sdk"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import useHasAccess from "hooks/useHasAccess"

const UserGroupListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [userGroup, setUserGroup] = useState({} as UserGroup)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (supplierId: string, userGroupId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const [groupAssignmentList, companyAssignmentList] = await Promise.all([
        await SecurityProfiles.ListAssignments({userGroupID: userGroupId, supplierID: supplierId}),
        await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Supplier", supplierID: supplierId})
      ])
      const assignments = [...groupAssignmentList.Items, ...companyAssignmentList.Items]
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getUserGroup = useCallback(async (supplierId: string, userGroupId: string) => {
    const _userGroup = await SupplierUserGroups.Get(supplierId, userGroupId)
    setUserGroup(_userGroup)
    return _userGroup
  }, [])

  const initialize = useCallback(
    async function (supplierId: string, userGroupId: string) {
      await Promise.all([getUserGroup(supplierId, userGroupId), getSecurityProfileAssignments(supplierId, userGroupId)])
      setLoading(false)
    },
    [getUserGroup, getSecurityProfileAssignments]
  )

  useEffect(() => {
    if (router.query.supplierid && router.query.usergroupid) {
      initialize(router.query.supplierid as string, router.query.usergroupid as string)
    }
  }, [router.query.supplierid, router.query.usergroupid, initialize])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <UserGroupFormForm
      userGroup={userGroup}
      userGroupType="buyer"
      parentId={router.query.buyerid as string}
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(router.query.buyerid as string, userGroup.ID)}
    />
  )
}

const ProtectedSupplierUserGroupListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SupplierUserGroupViewer, appPermissions.SupplierUserGroupManager]}>
      <Box padding="GlobalPadding">
        <UserGroupListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedSupplierUserGroupListItem

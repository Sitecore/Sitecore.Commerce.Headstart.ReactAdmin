import {AdminUserGroups, SecurityProfileAssignment, SecurityProfiles, UserGroup} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useState} from "react"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import useHasAccess from "hooks/useHasAccess"
import {UserGroupFormForm} from "@/components/usergroups"

const UserGroupListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [userGroup, setUserGroup] = useState({} as UserGroup)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (userGroupId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const [groupAssignmentList, companyAssignmentList] = await Promise.all([
        await SecurityProfiles.ListAssignments({userGroupID: userGroupId, commerceRole: "Seller"}),
        await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Seller"})
      ])
      const assignments = [...groupAssignmentList.Items, ...companyAssignmentList.Items]
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getUserGroup = useCallback(async (userGroupId: string) => {
    const _userGroup = await AdminUserGroups.Get<IBuyerUserGroup>(userGroupId)
    setUserGroup(_userGroup)
    return _userGroup
  }, [])

  const initialize = useCallback(
    async function (userGroupId: string) {
      await Promise.all([getUserGroup(userGroupId), getSecurityProfileAssignments(userGroupId)])
      setLoading(false)
    },
    [getUserGroup, getSecurityProfileAssignments]
  )

  useEffect(() => {
    if (router.query.usergroupid) {
      initialize(router.query.usergroupid as string)
    }
  }, [router.query.usergroupid, initialize])

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
      userGroupType="admin"
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(userGroup.ID)}
    />
  )
}
const ProtectedUserGroupListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.AdminUserGroupViewer, appPermissions.AdminUserGroupManager]}>
      <Box padding="GlobalPadding">
        <UserGroupListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedUserGroupListItem

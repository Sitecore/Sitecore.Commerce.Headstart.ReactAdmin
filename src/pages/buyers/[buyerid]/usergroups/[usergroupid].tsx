import {SecurityProfileAssignment, SecurityProfiles, UserGroup, UserGroups} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useState} from "react"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import {UserGroupFormForm} from "../../../../components/usergroups/UserGroupForm"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import ProtectedContent from "components/auth/ProtectedContent"
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
    async (buyerId: string, userGroupId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const [groupAssignmentList, companyAssignmentList] = await Promise.all([
        await SecurityProfiles.ListAssignments({userGroupID: userGroupId, buyerID: buyerId}),
        await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Buyer", buyerID: buyerId})
      ])
      const assignments = [...groupAssignmentList.Items, ...companyAssignmentList.Items]
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getUserGroup = useCallback(async (buyerId: string, userGroupId: string) => {
    const _userGroup = await UserGroups.Get<IBuyerUserGroup>(buyerId, userGroupId)
    setUserGroup(_userGroup)
    return _userGroup
  }, [])

  const initialize = useCallback(
    async function (buyerId: string, userGroupId: string) {
      await Promise.all([getUserGroup(buyerId, userGroupId), getSecurityProfileAssignments(buyerId, userGroupId)])
      setLoading(false)
    },
    [getUserGroup, getSecurityProfileAssignments]
  )

  useEffect(() => {
    if (router.query.buyerid && router.query.usergroupid) {
      initialize(router.query.buyerid as string, router.query.usergroupid as string)
    }
  }, [router.query.buyerid, router.query.usergroupid, initialize])

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
const ProtectedUserGroupListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerUserGroupViewer, appPermissions.BuyerUserGroupManager]}>
      <Box padding="GlobalPadding">
        <UserGroupListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedUserGroupListItem

import {useCallback, useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {AdminUserGroups, AdminUsers, SecurityProfileAssignment, SecurityProfiles, User} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IAdminUser} from "types/ordercloud/IAdminUser"
import {UserForm} from "@/components/users"
import useHasAccess from "hooks/useHasAccess"

const AdminUserListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState({} as User)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (userId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const [userAssignmentList, groupAssignmentList, companyAssignmentList] = await Promise.all([
        await SecurityProfiles.ListAssignments({userID: userId}),
        await SecurityProfiles.ListAssignments({level: "Group", commerceRole: "Seller"}).then(async (response) => {
          const allSecurityProfileGroupAssignments = response.Items
          const assignedGroups = await AdminUserGroups.ListUserAssignments({userID: userId, pageSize: 100})
          return allSecurityProfileGroupAssignments.filter((securityProfileAssignment) => {
            return assignedGroups.Items.some(
              (assignedGroup) => assignedGroup.UserGroupID === securityProfileAssignment.UserGroupID
            )
          })
        }),
        await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Seller"})
      ])
      const assignments = [...userAssignmentList.Items, ...groupAssignmentList, ...companyAssignmentList.Items]
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const initialize = useCallback(
    async function (userId: string) {
      const getAdminUser = async (userId: string) => {
        const user = await AdminUsers.Get<IAdminUser>(userId)
        setAdminUser(user)
        return user
      }

      await Promise.all([getAdminUser(userId), getSecurityProfileAssignments(userId)])
      setLoading(false)
    },
    [getSecurityProfileAssignments]
  )

  useEffect(() => {
    if (router.query.userid) {
      initialize(router.query.userid as string)
    }
  }, [router.query.userid, initialize])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <UserForm
      user={adminUser}
      userType="admin"
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(adminUser.ID)}
    />
  )
}

const ProtectedAdminUserListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.AdminUserViewer, appPermissions.AdminUserManager]}>
      <AdminUserListItem />
    </ProtectedContent>
  )
}

export default ProtectedAdminUserListItem

import {useCallback, useEffect, useState} from "react"
import {UserForm} from "../../../../components/users/UserForm"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {
  SecurityProfileAssignment,
  SecurityProfiles,
  SupplierUserGroups,
  SupplierUsers,
  User
} from "ordercloud-javascript-sdk"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import useHasAccess from "hooks/useHasAccess"

const UserListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({} as User)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (supplierId: string, userId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const [userAssignmentList, groupAssignmentList, companyAssignmentList] = await Promise.all([
        await SecurityProfiles.ListAssignments({userID: userId, supplierID: supplierId}),
        await SecurityProfiles.ListAssignments({level: "Group", commerceRole: "Supplier", supplierID: supplierId}).then(
          async (response) => {
            const allSecurityProfileGroupAssignments = response.Items
            const assignedGroups = await SupplierUserGroups.ListUserAssignments(supplierId, {
              userID: userId,
              pageSize: 100
            })
            return allSecurityProfileGroupAssignments.filter((securityProfileAssignment) => {
              return assignedGroups.Items.some(
                (assignedGroup) => assignedGroup.UserGroupID === securityProfileAssignment.UserGroupID
              )
            })
          }
        ),
        await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Supplier", supplierID: supplierId})
      ])
      const assignments = [...userAssignmentList.Items, ...groupAssignmentList, ...companyAssignmentList.Items]
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getUser = useCallback(async (supplierId, userId: string) => {
    const _user = await SupplierUsers.Get<ISupplierUser>(supplierId, userId)
    setUser(_user)
    return _user
  }, [])

  const initialize = useCallback(
    async function (supplierId: string, userId: string) {
      await Promise.all([getUser(supplierId, userId), getSecurityProfileAssignments(supplierId, userId)])
      setLoading(false)
    },
    [getUser, getSecurityProfileAssignments]
  )

  useEffect(() => {
    if (router.query.supplierid && router.query.userid) {
      initialize(router.query.supplierid as string, router.query.userid as string)
    }
  }, [router.query.supplierid, router.query.userid, initialize])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }

  return (
    <UserForm
      user={user}
      userType="supplier"
      parentId={router.query.supplierid.toString()}
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(router.query.supplierid as string, user.ID)}
    />
  )
}

const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SupplierUserViewer, appPermissions.SupplierUserManager]}>
      <UserListItem />
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

import {SecurityProfileAssignment, SecurityProfiles, User, UserGroups, Users} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {UserForm} from "../../../../components/users/UserForm"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import useHasAccess from "hooks/useHasAccess"

const UserListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({} as User)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (buyerId: string, userId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const [userAssignmentList, groupAssignmentList, companyAssignmentList] = await Promise.all([
        await SecurityProfiles.ListAssignments({userID: userId, buyerID: buyerId}),
        await SecurityProfiles.ListAssignments({level: "Group", commerceRole: "Buyer", buyerID: buyerId}).then(
          async (response) => {
            const allSecurityProfileGroupAssignments = response.Items
            const assignedGroups = await UserGroups.ListUserAssignments(buyerId, {userID: userId, pageSize: 100})
            return allSecurityProfileGroupAssignments.filter((securityProfileAssignment) => {
              return assignedGroups.Items.some(
                (assignedGroup) => assignedGroup.UserGroupID === securityProfileAssignment.UserGroupID
              )
            })
          }
        ),
        await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Buyer", buyerID: buyerId})
      ])
      const assignments = [...userAssignmentList.Items, ...groupAssignmentList, ...companyAssignmentList.Items]
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getUser = useCallback(async (buyerId, userId: string) => {
    const _user = await Users.Get<IBuyerUser>(buyerId, userId)
    setUser(_user)
    return _user
  }, [])

  const initialize = useCallback(
    async function (buyerId: string, userId: string) {
      await Promise.all([getUser(buyerId, userId), getSecurityProfileAssignments(buyerId, userId)])
      setLoading(false)
    },
    [getUser, getSecurityProfileAssignments]
  )

  useEffect(() => {
    if (router.query.buyerid && router.query.userid) {
      initialize(router.query.buyerid as string, router.query.userid as string)
    }
  }, [router.query.buyerid, router.query.userid, initialize])

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
      userType="buyer"
      parentId={router.query.buyerid.toString()}
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(router.query.buyerid as string, user.ID)}
    />
  )
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager]}>
      <UserListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

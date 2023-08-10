import {UserGroup, UserGroups} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import {UserGroupFormForm} from "../../../../components/usergroups/UserGroupForm"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

const UserGroupListItem = () => {
  const router = useRouter()
  const [userGroup, setUserGroup] = useState({} as UserGroup)
  useEffect(() => {
    const getUserGroup = async () => {
      const userGroup = await UserGroups.Get<IBuyerUserGroup>(
        router.query.buyerid as string,
        router.query.usergroupid as string
      )
      setUserGroup(userGroup)
    }
    if (router.query.buyerid && router.query.usergroupid) {
      getUserGroup()
    }
  }, [router.query.buyerid, router.query.usergroupid])
  return (
    <>
      {userGroup?.ID ? (
        <UserGroupFormForm userGroup={userGroup} userGroupService={UserGroups} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}
const ProtectedUserGroupListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <UserGroupListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedUserGroupListItem

import {UserGroup, UserGroups} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

import {Box, Container, Skeleton} from "@chakra-ui/react"
import {CreateUpdateForm} from "../../../../components/usergroups/CreateUpdateForm"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit user group",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

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
        <CreateUpdateForm userGroup={userGroup} ocService={UserGroups} />
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

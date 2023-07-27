import {useEffect, useState} from "react"
import {UserGroupFormForm} from "@/components/usergroups/UserGroupForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {UserGroup, UserGroups} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import {Container, Skeleton} from "@chakra-ui/react"

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
        <UserGroupFormForm userGroup={userGroup} userGroupService={UserGroups} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}
const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <UserGroupListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

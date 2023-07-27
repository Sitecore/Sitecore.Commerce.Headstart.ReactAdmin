import {useEffect, useState} from "react"
import {UserGroupFormForm} from "../../../../components/usergroups/UserGroupForm"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {SupplierUserGroups, UserGroup} from "ordercloud-javascript-sdk"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit user group",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: false
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
      const group = await SupplierUserGroups.Get<ISupplierUserGroup>(
        router.query.supplierid as string,
        router.query.usergroupid as string
      )
      setUserGroup(group)
    }
    if (router.query.supplierid && router.query.usergroupid) {
      getUserGroup()
    }
  }, [router.query.supplierid, router.query.usergroupid])
  return (
    <>
      {userGroup?.ID ? (
        <UserGroupFormForm userGroup={userGroup} userGroupService={SupplierUserGroups} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}
const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <UserGroupListItem />
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

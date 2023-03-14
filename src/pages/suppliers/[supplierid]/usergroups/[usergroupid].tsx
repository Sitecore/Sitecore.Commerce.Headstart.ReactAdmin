import {useEffect, useState} from "react"
import {CreateUpdateForm} from "../../../../components/usergroups/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {SupplierUserGroups, UserGroup} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
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
      {userGroup?.ID ? <CreateUpdateForm userGroup={userGroup} ocService={SupplierUserGroups} /> : <div> Loading</div>}
    </>
  )
}
const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <UserGroupListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

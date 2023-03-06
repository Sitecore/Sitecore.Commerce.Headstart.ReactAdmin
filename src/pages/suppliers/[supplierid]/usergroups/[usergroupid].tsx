import {useEffect, useState} from "react"
import {CreateUpdateForm} from "../../../../lib/components/usergroups/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {UserGroup} from "ordercloud-javascript-sdk"
import {appPermissions} from "lib/constants/app-permissions.config"
import {supplierUserGroupsService} from "../../../../lib/api"
import {useRouter} from "next/router"

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
  const [userGroup, setuserGroup] = useState({} as UserGroup)
  useEffect(() => {
    if (router.query.supplierid && router.query.usergroupid) {
      supplierUserGroupsService
        .getById(router.query.supplierid, router.query.usergroupid)
        .then((userGroup) => setuserGroup(userGroup))
    }
  }, [router.query.supplierid, router.query.usergroupid])
  return (
    <>
      {userGroup?.ID ? (
        <CreateUpdateForm userGroup={userGroup} ocService={supplierUserGroupsService} />
      ) : (
        <div> Loading</div>
      )}
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

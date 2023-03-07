import {useEffect, useState} from "react"
import {CreateUpdateForm} from "components/usergroups/CreateUpdateForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {UserGroup, UserGroups} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"

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
  return <>{userGroup?.ID ? <CreateUpdateForm userGroup={userGroup} ocService={UserGroups} /> : <div> Loading</div>}</>
}
const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <UserGroupListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

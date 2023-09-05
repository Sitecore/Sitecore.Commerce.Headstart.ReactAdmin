import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUserGroupList from "@/components/buyerusergroups/list/BuyerUserGroupList"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const UserGroupsList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerUserGroupList buyerid={buyerid} />
}

const ProtectedUserGroupsList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerUserGroupViewer, appPermissions.BuyerUserGroupManager]}>
      <UserGroupsList />
    </ProtectedContent>
  )
}
export default ProtectedUserGroupsList

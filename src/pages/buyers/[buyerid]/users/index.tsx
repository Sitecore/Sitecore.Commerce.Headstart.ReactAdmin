import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUserList from "@/components/buyerusers/list/BuyerUserList"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const UsersList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerUserList buyerid={buyerid} />
}

const ProtectedUsersList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager]}>
      <UsersList />
    </ProtectedContent>
  )
}
export default ProtectedUsersList

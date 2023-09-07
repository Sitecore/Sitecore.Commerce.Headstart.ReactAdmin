import React from "react"
import {useRouter} from "hooks/useRouter"
import SupplierUserList from "@/components/supplierusers/list/SupplierUserList"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const SupplierUsersListPage = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return <SupplierUserList supplierid={supplierID} />
}

const ProtectedSupplierUserListPage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SupplierUserViewer, appPermissions.SupplierUserManager]}>
      <SupplierUsersListPage />
    </ProtectedContent>
  )
}

export default ProtectedSupplierUserListPage

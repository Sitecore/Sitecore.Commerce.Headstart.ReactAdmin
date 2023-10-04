import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "config/app-permissions.config"
import SupplierList from "@/components/suppliers/list/SupplierList"

const ProtectedSuppliersList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SupplierViewer, appPermissions.SupplierManager]}>
      <SupplierList />
    </ProtectedContent>
  )
}

export default ProtectedSuppliersList

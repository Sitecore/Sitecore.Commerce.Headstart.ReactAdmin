import React from "react"
import AdminUserGroupList from "@/components/adminusergroups/list/AdminUserGroupList"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const AdminUserGroupsListPage = () => {
  return <AdminUserGroupList />
}

const ProtectedAdminuserGroupsList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.AdminUserGroupViewer, appPermissions.AdminUserGroupManager]}>
      <AdminUserGroupsListPage />
    </ProtectedContent>
  )
}

export default ProtectedAdminuserGroupsList

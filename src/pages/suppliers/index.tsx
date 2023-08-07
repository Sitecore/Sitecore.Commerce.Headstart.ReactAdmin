import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "config/app-permissions.config"
import SupplierList from "@/components/suppliers/list/SupplierList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Suppliers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedSuppliersList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierList />
    </ProtectedContent>
  )
}

export default ProtectedSuppliersList

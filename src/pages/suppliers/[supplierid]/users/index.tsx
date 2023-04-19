import React from "react"
import {useRouter} from "hooks/useRouter"
import SupplierUserList from "@/components/supplierursers/list/SupplierUserList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Users List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UsersList = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return <SupplierUserList supplierid={supplierID} />
}

export default UsersList

import React from "react"
import {useRouter} from "hooks/useRouter"
import SupplierUserList from "@/components/supplierusers/list/SupplierUserList"

const UsersList = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return <SupplierUserList supplierid={supplierID} />
}

export default UsersList

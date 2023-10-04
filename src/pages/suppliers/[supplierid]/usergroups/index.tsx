import {useRouter} from "hooks/useRouter"
import SupplierUserGroupList from "@/components/supplierusergroups/list/SupplierUserGroupList"

const UserGroupsList = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return <SupplierUserGroupList supplierid={supplierID} />
}

export default UserGroupsList


import { useRouter } from "hooks/useRouter"
import SupplierUserGroupList from "@/components/supplierusergroups/list/SupplierUserGroupList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "User groups List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UserGroupsList = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return <SupplierUserGroupList supplierid={supplierID} />
}

export default UserGroupsList

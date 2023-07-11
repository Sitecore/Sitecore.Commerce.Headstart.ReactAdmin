//import {useRouter} from "hooks/useRouter"
//import SupplierUserGroupList from "@/components/supplierusergroups/list/SupplierUserGroupList"
import SupplierAddressList from "@/components/supplieraddresses/list/SupplierAddressList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Supplier Addresses List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const AddressList = () => {
  //const router = useRouter()
  //const supplierID = router.query.supplierid as string

  return <SupplierAddressList />
}

export default AddressList

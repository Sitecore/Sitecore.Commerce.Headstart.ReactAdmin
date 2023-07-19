import {Box} from "@chakra-ui/react"
import {CreateUpdateForm} from "../../components/suppliers/CreateUpdateForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {ISupplier} from "types/ordercloud/ISupplier"

const supplier = {Name: "", Active: false, AllBuyersCanOrder: false, DateCreated: ""} as ISupplier
/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new supplier",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedCreateUpdateForm() {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <CreateUpdateForm supplier={supplier} />
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm

import {UserForm} from "../../../../components/users"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {SupplierUsers} from "ordercloud-javascript-sdk"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new user",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedNewSupplierUser = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <UserForm userService={SupplierUsers} />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierUser

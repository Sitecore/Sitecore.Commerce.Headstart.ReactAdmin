import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import AdminAddressList from "@/components/adminaddresses/list/AdminAddressList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Admin Address List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProtectedAdminAddresses = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminAddressList />
    </ProtectedContent>
  )
}

export default ProtectedAdminAddresses

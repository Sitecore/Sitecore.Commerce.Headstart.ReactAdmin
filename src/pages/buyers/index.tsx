import BuyerList from "@/components/buyers/list/BuyerList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Buyers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedBuyersList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <BuyerList />
    </ProtectedContent>
  )
}

export default ProtectedBuyersList

import {CatalogForm} from "components/catalogs"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new catalog",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedNewCatalogPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <CatalogForm />
    </ProtectedContent>
  )
}

export default ProtectedNewCatalogPage

import {useEffect, useState} from "react"
import {CreateUpdateForm} from "components/catalogs/CreateUpdateForm"
import {Catalog, Catalogs} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
import {ICatalog} from "types/ordercloud/ICatalog"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit catalog",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CatalogListItem = () => {
  const router = useRouter()
  const [catalog, setCatalog] = useState({} as Catalog)
  useEffect(() => {
    if (router.query.catalogid) {
      Catalogs.Get<ICatalog>(router.query.catalogid as string).then((catalog) => setCatalog(catalog))
    }
  }, [router.query.catalogid])
  return <>{catalog?.ID ? <CreateUpdateForm catalog={catalog} /> : <div> Loading</div>}</>
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <CatalogListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

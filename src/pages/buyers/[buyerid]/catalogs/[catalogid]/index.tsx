import {useEffect, useState} from "react"
import {CreateUpdateForm} from "lib/components/catalogs/CreateUpdateForm"
import {Catalog} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {catalogsService} from "lib/api"
import {useRouter} from "next/router"

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
      catalogsService.getById(router.query.catalogid).then((catalog) => setCatalog(catalog))
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

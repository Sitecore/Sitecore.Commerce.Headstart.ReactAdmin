import {Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {CatalogForm} from "@/components/catalogs/CatalogForm"
import {ICatalog} from "types/ordercloud/ICatalog"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {Container, Skeleton} from "@chakra-ui/react"

const CatalogListItem = () => {
  const router = useRouter()
  const [catalog, setCatalog] = useState({} as Catalog)
  useEffect(() => {
    if (router.query.catalogid) {
      Catalogs.Get<ICatalog>(router.query.catalogid as string).then((catalog) => setCatalog(catalog))
    }
  }, [router.query.catalogid])
  return (
    <>
      {catalog?.ID ? (
        <CatalogForm catalog={catalog} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedCatalogListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager]}>
      <CatalogListItem />
    </ProtectedContent>
  )
}

export default ProtectedCatalogListItem

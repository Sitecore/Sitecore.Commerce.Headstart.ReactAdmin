import {useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {ProductFacet, ProductFacets} from "ordercloud-javascript-sdk"
import {appPermissions} from "config/app-permissions.config"
import {ProductFacetForm} from "components/productfacets"
import {useRouter} from "hooks/useRouter"
import {IProductFacet} from "types/ordercloud/IProductFacet"

const ProductFacetsListItem = () => {
  const router = useRouter()
  const [productfacet, setProductFacet] = useState({} as ProductFacet)
  useEffect(() => {
    if (router.query.productfacetid) {
      ProductFacets.Get<IProductFacet>(router.query.productfacetid as string).then((productfacet) =>
        setProductFacet(productfacet)
      )
    }
  }, [productfacet?.ID, router.query.productfacetid])

  return (
    <>
      {productfacet?.ID ? (
        <ProductFacetForm productFacet={productfacet} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedProductFacetsListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.ProductFacetViewer, appPermissions.ProductFacetManager]}>
      <ProductFacetsListItem />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsListItem

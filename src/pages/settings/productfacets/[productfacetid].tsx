import {useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {ProductFacet, ProductFacets} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {ProductFacetForm} from "components/productfacets"
import {useRouter} from "hooks/useRouter"
import {IProductFacet} from "types/ordercloud/IProductFacet"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit product facet",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

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
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductFacetsListItem />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsListItem

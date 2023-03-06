import {useEffect, useState} from "react"

import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {ProductFacet, User} from "ordercloud-javascript-sdk"
import {appPermissions} from "lib/constants/app-permissions.config"
import {productfacetsService} from "lib/api/productfacets"
import {CreateUpdateForm} from "lib/components/productfacets"
import router, {useRouter} from "next/router"
import {useToast} from "@chakra-ui/react"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Update product facet",
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
    if (router.query.id) {
      productfacetsService.getById(router.query.id).then((productfacet) => setProductFacet(productfacet))
    }
  }, [productfacet?.ID, router.query.id])

  return <>{productfacet?.ID ? <CreateUpdateForm productfacet={productfacet} /> : <div> Loading</div>}</>
}

const ProtectedProductFacetsListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <Box padding="GlobalPadding">
        <ProductFacetsListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsListItem

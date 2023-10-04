import {Container} from "@chakra-ui/react"
import {ProductFacetForm} from "../../../components/productfacets/ProductFacetForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {NextSeo} from "next-seo"

const NewProductFacetsPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Product Facets" />
      <ProductFacetForm />
    </Container>
  )
}

const ProtectedProductFacetsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductFacetManager}>
      <NewProductFacetsPage />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsPage

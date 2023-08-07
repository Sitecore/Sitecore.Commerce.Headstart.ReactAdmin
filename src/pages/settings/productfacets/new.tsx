import {Container} from "@chakra-ui/react"
import {ProductFacetForm} from "../../../components/productfacets/ProductFacetForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {NextSeo} from "next-seo"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a Product Facet",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

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
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <NewProductFacetsPage />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsPage

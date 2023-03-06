import {Box, Container} from "@chakra-ui/react"
import {CreateUpdateForm} from "../../../lib/components/productfacets/CreateUpdateForm"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
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
      <CreateUpdateForm />
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

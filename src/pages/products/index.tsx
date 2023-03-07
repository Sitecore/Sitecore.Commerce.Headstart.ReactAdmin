import {Box, Flex} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import ProductSearch from "components/products/ProductSearch"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import React, {useEffect, useState} from "react"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Products List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const Products = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const searchQuery = router.query.query as string
    setQuery(searchQuery)
  }, [router.query.query])

  return (
    <>
      <Box pl="GlobalPadding">
        <ProductSearch query={query} />
      </Box>
    </>
  )
}

const ProtectedProducts = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <Products />
    </ProtectedContent>
  )
}

export default ProtectedProducts

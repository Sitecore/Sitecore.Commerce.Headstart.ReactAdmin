import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react"
import {appPermissions} from "constants/app-permissions.config"
import {useProductDetail} from "hooks/useProductDetail"
import {NextSeo} from "next-seo"

/* This declares the page title and enables breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Detail",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductDetailPage = () => {
  const {product, defaultPriceSchedule, specs, variants, loading, showTabbedView, initialTab} = useProductDetail()

  if (loading || !product) {
    return (
      <Flex flexGrow="1" id="skeleton-loader--product">
        <NextSeo title="Product Detail" />
        <Container
          display="flex"
          flexFlow="column nowrap"
          maxW="100%"
          bgColor="st.mainBackgroundColor"
          flexGrow={1}
          p={[4, 6, 8]}
        >
          <HStack mb={6}>
            <Skeleton borderRadius="md" w="100%" h="40px" />
          </HStack>

          <HStack mb={6}>
            <Skeleton borderRadius="md" w="100%" h="30px" />
          </HStack>

          <Flex h={"100%"} gap={6}>
            <VStack gap={6} flexGrow="1">
              <Skeleton borderRadius="md" w="100%" h={"216px"} />
              <Skeleton borderRadius="md" w="100%" h={"184px"} />
              <Skeleton borderRadius="md" w="100%" h={"192px"} />
            </VStack>
            <Skeleton borderRadius="md" w="340px" h={"520px"} />
          </Flex>
        </Container>
      </Flex>
    )
  }

  return (
    <ProductDetail
      showTabbedView={showTabbedView}
      initialTab={initialTab}
      product={product}
      defaultPriceSchedule={defaultPriceSchedule}
      specs={specs}
      variants={variants}
    />
  )
}

const ProtectedProductDetailPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedProductDetailPage

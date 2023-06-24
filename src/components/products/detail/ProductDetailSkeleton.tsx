import {Flex, Container, HStack, Skeleton, VStack} from "@chakra-ui/react"
import {NextSeo} from "next-seo"

export function ProductDetailSkeleton() {
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

import {Flex, Container, Skeleton, VStack} from "@chakra-ui/react"

interface OrderReturnDetailSkeletonSkeletonProps {}
export function OrderReturnDetailSkeleton({}: OrderReturnDetailSkeletonSkeletonProps) {
  const orderDetailCardGap = 3
  return (
    <Flex flexGrow="1">
      <Container
        display="flex"
        flexFlow="column nowrap"
        maxW="100%"
        bgColor="st.mainBackgroundColor"
        flexGrow={1}
        p={[4, 6, 8]}
      >
        <Skeleton borderRadius="md" w="300px" h="40px" marginBottom="28px" />
        <VStack gap={orderDetailCardGap} width="full">
          {/* Order Header */}
          <Skeleton borderRadius="md" width="100%" h="160px" />
          {/* Products */}
          <Skeleton borderRadius="md" w="100%" h="500px" />
        </VStack>
      </Container>
    </Flex>
  )
}

import {Flex, Container, Skeleton, VStack, Stack} from "@chakra-ui/react"
import {useAuth} from "hooks/useAuth"

interface OrderDetailSkeletonProps {}
export function OrderDetailSkeleton({}: OrderDetailSkeletonProps) {
  const {isAdmin} = useAuth()
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
          <Skeleton borderRadius="md" width="100%" h="102px" />
          <Stack
            width="full"
            direction={["column", "column", "column", "column", "row"]}
            alignItems="start"
            gap={orderDetailCardGap}
          >
            <VStack width="full" flexGrow={1} gap={orderDetailCardGap}>
              {/* Products */}
              <Skeleton borderRadius="md" w="100%" h="500px" />
              {/* Payment Card */}
              {isAdmin && <Skeleton borderRadius="md" w="100%" h="160px" />}
            </VStack>
            <VStack width="full" maxWidth={{xl: "350px"}} flexGrow={1} gap={orderDetailCardGap}>
              {/* Customer Card */}
              {isAdmin && <Skeleton borderRadius="md" w="100%" h="251px" />}
              {/* Order Summary Card */}
              <Skeleton borderRadius="md" w="100%" h="225px" />
            </VStack>
          </Stack>
        </VStack>
      </Container>
    </Flex>
  )
}

import {Container, Skeleton} from "@chakra-ui/react"

interface PromotionDetailSkeletonProps {}
export function PromotionDetailSkeleton({}: PromotionDetailSkeletonProps) {
  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Skeleton w="100%" h="544px" borderRadius="md" />
    </Container>
  )
}

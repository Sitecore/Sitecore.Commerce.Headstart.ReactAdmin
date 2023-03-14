import {Flex, VStack, Text} from "@chakra-ui/react"
import {Link} from "./Link"

const TopCategoriesNavigation = () => {
  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
          Top Categories
        </Text>
        <Link href="/home">Category 1</Link>
        <Link href="/blog">Category 2</Link>
        <Link href="/pages">Category 3</Link>
        <Link href="/shop">Category 4</Link>
        <Link href="/shop">Category 5</Link>
      </VStack>
    </Flex>
  )
}

export default TopCategoriesNavigation

import {Flex, Link, VStack, Text} from "@chakra-ui/react"

const ShoppingNavigation = () => {
  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
          My Account
        </Text>
        <Link href="/home">Check Out</Link>
        <Link href="/blog">Cart</Link>
        <Link href="/pages">Products</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/shop">Legal</Link>
      </VStack>
    </Flex>
  )
}

export default ShoppingNavigation

import {Flex, Tag, Text, VStack, useColorMode, useColorModeValue} from "@chakra-ui/react"
import {Link} from "./Link"

const InformationNavigation = () => {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
          About Us
        </Text>
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about-us">About Us</Link>
        <Link href="/shop">
          Shop{" "}
          <Tag
            size={"sm"}
            bg={useColorModeValue("brand.500", "brand.700")}
            ml={2}
            color={useColorModeValue("textColor.900", "textColor.100")}
          >
            New
          </Tag>
        </Link>
        <Link href="/contact-us">Contact Us</Link>
      </VStack>
    </Flex>
  )
}

export default InformationNavigation

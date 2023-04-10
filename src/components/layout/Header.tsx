import { HStack, useColorModeValue, Heading, Flex, Show, Container, useColorMode } from "@chakra-ui/react"
import HeaderLogo from "components/branding/HeaderLogo"
import AcountNavigation from "components/navigation/AcountNavigation"

const Header = () => {
  return (
    <Container backgroundColor={useColorModeValue("white", "gray.600")} maxW="full" as="header" position="sticky" top="0px" zIndex="10" shadow="md">
      <HStack justifyContent="space-between" h="80px">
        <HStack>
          <HeaderLogo />
        </HStack>
        <AcountNavigation />
      </HStack>
    </Container>
  )
}

export default Header

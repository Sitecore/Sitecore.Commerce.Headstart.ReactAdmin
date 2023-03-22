import {HStack, useColorModeValue, Heading, Flex, Show, Container} from "@chakra-ui/react"
import HeaderLogo from "components/branding/HeaderLogo"
import AcountNavigation from "components/navigation/AcountNavigation"

const Header = () => {
  return (
    <Container as="header" maxWidth="100%" background="Background" position="sticky" top="0px" zIndex="10" shadow="md">
      <HStack justifyContent="space-between" h="80px">
        <HStack>
          <HeaderLogo />
          <Show breakpoint="(min-width: 900px)">
            <Heading as="h4" color="gray.500" fontSize="large" pl="10" fontWeight="normal">
              Seller Administration
            </Heading>
          </Show>
        </HStack>
        <AcountNavigation />
      </HStack>
    </Container>
  )
}

export default Header

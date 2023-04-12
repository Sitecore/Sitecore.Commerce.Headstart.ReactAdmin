import { HStack, useColorModeValue, Heading, Flex, Show, Container, useColorMode } from "@chakra-ui/react"
import HeaderLogo from "components/branding/HeaderLogo"
import AcountNavigation from "components/navigation/AcountNavigation"
import schraTheme from "theme/theme"

const Header = () => {
  return (
    <Container as="header" backgroundColor={useColorModeValue("white", "whiteAlpha.100")} boxShadow="sm" maxW="full" position="sticky" top="0px" zIndex="10" borderBottom={`.5px solid ${schraTheme.colors.blackAlpha[300]}`}>
      <HStack justifyContent="space-between" alignItems={"center"} h="headerHeight">
        <HeaderLogo />
        <AcountNavigation />
      </HStack>
    </Container>
  )
}

export default Header

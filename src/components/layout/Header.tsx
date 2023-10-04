import {HStack, useColorModeValue, Container, Show} from "@chakra-ui/react"
import AcountNavigation from "components/navigation/AcountNavigation"
import {NavMenuDrawer} from "../navigation/NavMenuDrawer"
import {HeaderLogo} from "../branding/HeaderLogo"

const Header = () => {
  return (
    <Container
      as="header"
      backgroundColor={useColorModeValue("white", "gray.800")}
      boxShadow="sm"
      maxW="full"
      position="sticky"
      top="0px"
      zIndex="10"
      borderBottom={".5px solid"}
      borderColor="chakra-border-color"
    >
      <HStack justifyContent="space-between" alignItems={"center"} h="headerHeight" px={[0, 4]}>
        <Show below="sm">
          <NavMenuDrawer />
        </Show>
        <HeaderLogo width={["150px", "auto"]} />
        <AcountNavigation />
      </HStack>
    </Container>
  )
}

export default Header

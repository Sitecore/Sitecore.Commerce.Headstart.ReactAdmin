import {HStack, useColorModeValue, Container, Show} from "@chakra-ui/react"
import AcountNavigation from "components/navigation/AcountNavigation"
import {MyCommerceLogo} from "../branding/MyCommerceLogo"
import {NavMenuDrawer} from "../navigation/NavMenuDrawer"

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
      borderColor="st.borderColor"
    >
      <HStack justifyContent="space-between" alignItems={"center"} h="headerHeight" px={[0, 4]}>
        <Show below="sm">
          <NavMenuDrawer />
        </Show>
        <MyCommerceLogo width={["150px", "auto"]} />
        <AcountNavigation />
      </HStack>
    </Container>
  )
}

export default Header

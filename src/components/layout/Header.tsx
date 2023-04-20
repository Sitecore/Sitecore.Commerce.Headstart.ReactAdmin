import {HStack, useColorModeValue, Container} from "@chakra-ui/react"
import AcountNavigation from "components/navigation/AcountNavigation"
import {MyCommerceLogo} from "../branding/MyCommerceLogo"

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
      <HStack justifyContent="space-between" alignItems={"center"} h="headerHeight" px={4}>
        <MyCommerceLogo />
        <AcountNavigation />
      </HStack>
    </Container>
  )
}

export default Header

import {Box, Container, Flex, HStack} from "@chakra-ui/react"
import {ReactNode, useEffect, useState} from "react"

import ContentFooter from "./ContentFooter"
import ContentHeader from "./ContentHeader"
import Footer from "./Footer"
import Header from "./Header"
import LeftNavigation from "components/navigation/SideNavigation"
import {useAuth} from "hooks/useAuth"

const Layout = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const auth = useAuth()
  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated)
  }, [auth.isAuthenticated])
  if (!isAuthenticated) {
    return (
      <Flex width="100vw" height="100vh" alignItems="center" justify="center">
        {props.children}
      </Flex>
    )
  }
  return (
    <Box as="section" w="100%" margin="0 auto" transition="0.5s ease-out">
      <Header />
      <HStack alignItems="start" gap={5}>
        <LeftNavigation />
        <Box flexGrow={1} overflowX="hidden">
          <ContentHeader {...props} />
          {props.children}
          <ContentFooter />
        </Box>
      </HStack>
      <Footer />
    </Box>
  )
}

export default Layout

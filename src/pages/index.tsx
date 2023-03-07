import {Flex, useColorMode} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import Login from "../components/account/Login"
import {useRouter} from "hooks/useRouter"

const Home = () => {
  const {push} = useRouter()
  const {colorMode, toggleColorMode} = useColorMode()
  const handleOnLoggedIn = () => {
    push("/dashboard")
  }

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" minHeight="70vh" gap={4} mb={8} w="full">
      <NextSeo title="Home" />
      <Login onLoggedIn={handleOnLoggedIn} />
    </Flex>
  )
}

export default Home

import {Grid} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import Login from "../components/account/Login"
import {useRouter} from "hooks/useRouter"

const Home = () => {
  const {push} = useRouter()
  const handleOnLoggedIn = () => {
    push("/dashboard")
  }

  return (
    <Grid h={"100vh"} w={"100vw"} placeItems={"center center"}>
      <NextSeo title="Home" />
      <Login onLoggedIn={handleOnLoggedIn} />
    </Grid>
  )
}

export default Home

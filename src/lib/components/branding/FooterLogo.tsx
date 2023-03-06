import {Image, useColorMode} from "@chakra-ui/react"
import {Link} from "../navigation/Link"

const FooterLogo = () => {
  const {colorMode} = useColorMode()
  return (
    <Link href="/">
      {colorMode === "dark" ? (
        <Image objectFit="inherit" src="/Brand_Logo_White.png" alt="Sitecore" maxW="200px" />
      ) : (
        <Image objectFit="inherit" src="/Brand_Logo.png" alt="Sitecore" maxW="200px" />
      )}
    </Link>
  )
}

export default FooterLogo

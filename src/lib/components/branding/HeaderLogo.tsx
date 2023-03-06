import {Image, HStack, useColorMode} from "@chakra-ui/react"
import {Link} from "../navigation/Link"

const HeaderLogo = () => {
  const {colorMode} = useColorMode()
  return (
    <HStack>
      <Link pt="2px" href="/">
        {colorMode === "dark" ? (
          <Image width="100%" maxW="250px" objectFit="contain" src="/Brand_Logo_White.png" alt="Sitecore" />
        ) : (
          <Image maxW="250px" width="100%" objectFit="contain" src="/Brand_Logo.png" alt="Sitecore" />
        )}
      </Link>
    </HStack>
  )
}

export default HeaderLogo

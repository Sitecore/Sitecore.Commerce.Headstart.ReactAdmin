import {Image, HStack, useColorMode} from "@chakra-ui/react"
import {Link} from "../navigation/Link"

const HeaderLogo = () => {
  const {colorMode} = useColorMode()
  return (
    <HStack>
      <Link pt="2px" href="/">
        {colorMode === "dark" ? (
          <Image maxH="60px" objectFit="contain" src="/Brand_Logo_White.png" alt="Sitecore" />
        ) : (
          <Image maxH="60px" objectFit="contain" src="/Brand_Logo.png" alt="Sitecore" />
        )}
      </Link>
    </HStack>
  )
}

export default HeaderLogo

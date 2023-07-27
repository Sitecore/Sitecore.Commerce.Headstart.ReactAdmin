import {Image, useColorMode} from "@chakra-ui/react"
import {Link} from "../navigation/Link"

const HeaderLogo = () => {
  const {colorMode} = useColorMode()
  return (
    <Link href="/">
      <Image
        w={165}
        src={colorMode === "dark" ? "/vector/my-commerce--dark.svg" : "/vector/my-commerce--default.svg"}
        alt="MyCommerce Marketplace"
      />
    </Link>
  )
}

export default HeaderLogo

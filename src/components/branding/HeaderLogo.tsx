import {IconProps, Image} from "@chakra-ui/react"
import {Link} from "../navigation/Link"

interface HeaderLogoProps extends IconProps {}
export function HeaderLogo({...iconProps}: HeaderLogoProps) {
  return (
    <Link href="/" display="flex" alignItems="center" height="100%">
      <Image src="/vector/shop.svg" alt="PLAY! Marketplace logo" {...iconProps} />
    </Link>
  )
}

import {IconProps} from "@chakra-ui/react"
import {Link} from "../navigation/Link"
import {MyCommerceIcon} from "../icons/Icons"

interface HeaderLogoProps extends IconProps {}
export function HeaderLogo({...iconProps}: HeaderLogoProps) {
  return (
    <Link href="/" display="flex" alignItems="center" height="100%">
      <MyCommerceIcon {...iconProps} />
    </Link>
  )
}

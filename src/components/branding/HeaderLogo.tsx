import {IconProps} from "@chakra-ui/react"
import {Link} from "../navigation/Link"
import {MyCommerceIcon} from "../icons/Icons"

interface HeaderLogoProps extends IconProps {}
export function HeaderLogo({...iconProps}: HeaderLogoProps) {
  return (
    <Link href="/" height="100%">
      <MyCommerceIcon {...iconProps} />
    </Link>
  )
}

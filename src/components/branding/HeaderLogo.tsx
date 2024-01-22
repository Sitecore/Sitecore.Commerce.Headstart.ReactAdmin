import {IconProps, Image, ImageProps} from "@chakra-ui/react"
import {Link} from "@chakra-ui/next-js"
import {MyCommerceIcon} from "../icons/Icons"
import {appSettings} from "config/app-settings"

type HeaderLogoProps = IconProps & ImageProps

export function HeaderLogo({...headerLogoProps}: HeaderLogoProps) {
  return (
    <Link href="/" display="flex" alignItems="center" height="100%">
      {appSettings.themeLogoUrl ? (
        <Image src={appSettings.themeLogoUrl} alt="Logo" {...headerLogoProps} height="80%" width="auto" padding={2} />
      ) : (
        <MyCommerceIcon {...headerLogoProps} />
      )}
    </Link>
  )
}

import NextLink from "next/link"
import {Link as ChakraLink, HTMLChakraProps, ThemingProps} from "@chakra-ui/react"

interface ChakraLinkProps extends HTMLChakraProps<"a">, ThemingProps<"Link"> {
  /**
   *  If `true`, the link will open in new tab
   *
   * @default false
   */
  isExternal?: boolean
}

// combines chakra ui, with functionality needed for nextjs links
// https://jools.dev/using-nextjs-link-with-chakra-ui-link

export const Link = ({href, children, ...props}: ChakraLinkProps) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink {...props}>{children}</ChakraLink>
    </NextLink>
  )
}

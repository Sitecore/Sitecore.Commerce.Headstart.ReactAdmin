import {Flex, Text, VStack} from "@chakra-ui/react"
import {ReactNode} from "react"
import {Link} from "./Link"

const FooterLinksNavigation = () => {
  const ListHeader = ({children}: {children: ReactNode}) => {
    return (
      <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
        {children}
      </Text>
    )
  }

  return (
    <Flex width="full" align="left">
      <VStack align="left">
        <ListHeader>Policies</ListHeader>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/refund-policy">Refund Policy</Link>
        <Link href="/cookie-policy">Cookie Policy</Link>
        <Link href="/terms-and-conditions">Terms & Conditions</Link>
      </VStack>
    </Flex>
  )
}

export default FooterLinksNavigation

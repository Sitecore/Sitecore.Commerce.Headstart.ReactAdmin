import {Text, useColorMode, useColorModeValue, Button, HStack, Container} from "@chakra-ui/react"
import {Link} from "@chakra-ui/next-js"

const Footer = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue("footerBg.400", "footerBg.600")
  const color = useColorModeValue("blackAlpha.400", "whiteAlpha.400")

  return (
    <Container
      as="footer"
      maxW={"full"}
      h={"headerHeight"}
      display="flex"
      flexFlow={"row nowrap"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg={useColorModeValue("white", "blackAlpha.600")}
      color={color}
      px={8}
    >
      <Text fontSize={"sm"} textAlign={"center"} data-testid="copyright">
        Copyright © {new Date().getFullYear()} Sitecore All Rights Reserved.
      </Text>
      <HStack alignItems="center" m={0} gap={2}>
        <Button
          fontSize="xs"
          color={color}
          as={Link}
          variant="link"
          target={"_blank"}
          rel="noreferrer"
          href="https://www.sitecore.com/trust"
        >
          Trust Center
        </Button>
        <Button
          fontSize="xs"
          as={Link}
          color={color}
          variant="link"
          target={"_blank"}
          rel="noreferrer"
          href="https://www.sitecore.com/trust/privacy-policy"
        >
          Privacy
        </Button>
        <Button
          fontSize="xs"
          as={Link}
          color={color}
          variant="link"
          target={"_blank"}
          rel="noreferrer"
          href="https://www.sitecore.com/legal"
        >
          Legal
        </Button>
      </HStack>
    </Container>
  )
}

export default Footer

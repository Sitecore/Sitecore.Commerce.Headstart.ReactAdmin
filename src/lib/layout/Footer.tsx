import {Flex, Box, Text, useColorMode, useColorModeValue} from "@chakra-ui/react"
import FooterLogo from "lib/components/branding/FooterLogo"

const Footer = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue("footerBg.400", "footerBg.600")
  const color = useColorModeValue("textColor.900", "textColor.100")

  return (
    <Box bg={bg} color={color} as="footer">
      <Box py={10}>
        <Flex
          align={"center"}
          _before={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            mr: 8
          }}
          _after={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            ml: 8
          }}
        >
          <FooterLogo />
        </Flex>
        <Text pt={6} fontSize={"sm"} textAlign={"center"}>
          Copyright © {new Date().getFullYear()} Sitecore.com All Rights Reserved.
        </Text>
      </Box>
    </Box>
  )
}

export default Footer

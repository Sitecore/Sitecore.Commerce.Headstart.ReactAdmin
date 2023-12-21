import {Box, Button, Heading, Image, Text, useColorMode, Flex} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import MotionBox from "components/motion/Box"
import {Link} from "@chakra-ui/next-js"

const Page404 = () => {
  const {colorMode} = useColorMode()

  return (
    <Flex minHeight="70vh" direction="column" justifyContent="center">
      <NextSeo title="404 Not Found" />
      <MotionBox
        animate={{y: 20}}
        transition={{repeat: Infinity, duration: 2, repeatType: "reverse"}}
        width={{base: "100%", sm: "70%", md: "60%"}}
        margin="0 auto"
      >
        <Image src="/vector/404 Error-pana.svg" alt="Error 404 not found Illustration" />
      </MotionBox>
      <Text textAlign="center" fontSize="xs" color="gray">
        <Link href="https://stories.freepik.com/web" rel="noopener noreferrer">
          Illustration by Freepik Stories
        </Link>
      </Text>

      <Box marginY={4}>
        <Heading textAlign="center" size="lg">
          Page not Found.
        </Heading>

        <Box textAlign="center" marginTop={4}>
          <Text fontSize="sm" color="gray">
            It&apos;s Okay!
          </Text>
          <Link href="/">
            <Button backgroundColor={colorMode === "light" ? "gray.300" : "accent.500"} size="sm">
              Let&apos;s Head Back
            </Button>
          </Link>
        </Box>
      </Box>
    </Flex>
  )
}

export default Page404

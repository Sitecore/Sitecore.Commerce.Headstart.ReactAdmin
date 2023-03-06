import {Badge, Box, HStack, Text} from "@chakra-ui/react"

export default function LettersCard(props) {
  var str = new String(props.FirstName)
  var strlast = new String(props.LastName)
  const firstnameletter = str.charAt(0)
  const lastnameletter = strlast.charAt(0)
  return (
    <Badge
      bg="brand.500"
      borderRadius="50%"
      alignItems="center"
      textAlign="center"
      display="flex"
      shadow="xl"
      width="40px"
      height="40px"
      _hover={{
        bg: "brand.600",
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      <HStack w="full" color="white" width="100%">
        <Text fontSize="18px" width="100%" fontWeight="normal">
          {firstnameletter}
          {lastnameletter}
        </Text>
      </HStack>
    </Badge>
  )
}

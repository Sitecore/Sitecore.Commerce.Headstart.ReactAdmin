import {Flex, Text, Box, Icon, useColorModeValue} from "@chakra-ui/react"
import React from "react"
import Card from "../card/Card"

export default function PercentChangeTitle(prop) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const bgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")
  const headingColor = useColorModeValue("boxTextColor.400", "boxTextColor.300")
  return (
    <Card p="28px 10px 0px 0px" mb={{sm: "0px", lg: "0px"}} bg={bgColor} showclosebutton="false" h="full">
      <Flex direction="column" alignSelf="flex-start">
        <Text fontSize="lg" mb="6px" textTransform="uppercase" color={headingColor}>
          {prop.title}
        </Text>
        <Text fontSize="lg" fontWeight="bold" color={color}>
          {prop.totalamount}
        </Text>
        <Text fontSize="sm" fontWeight="medium" color={color} pt="30px">
          {prop.percentchangetype === "pos" ? (
            <Text as="span" color="green.400" fontWeight="bold" pr="15px">
              + {prop.percentchange}%
            </Text>
          ) : (
            <Text as="span" color="red.400" fontWeight="bold" pr="15px">
              {prop.percentchange}%
            </Text>
          )}
          {prop.percentlabel}
        </Text>
      </Flex>
      <Box
        maxH="50px"
        maxW="50px"
        width="100%"
        height="100%"
        position="absolute"
        right="10px"
        top="10px"
        borderRadius="50%"
        background="blue.500"
        fontSize="28px"
        color="white"
      >
        <Box position="absolute" left="11px" top="8px">
          {prop.icon}
        </Box>
      </Box>
    </Card>
  )
}

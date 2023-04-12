import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { Flex, Card, Text, Box, Icon, useColorModeValue, CardHeader, CardBody, Heading, IconButton } from "@chakra-ui/react"
import React from "react"
import { TbArrowsDiagonal, TbArrowsDiagonal2, TbLayoutNavbarExpand, TbLayoutSidebarLeftExpand } from "react-icons/tb"
import schraTheme from "theme/theme"

export default function PercentChangeTitle(prop) {
  const color = useColorModeValue("blackAlpha.500", "whiteAlpha.500")
  const labelColor = useColorModeValue("blackAlpha.400", "whiteAlpha.500")
  const borderColorPos = useColorModeValue("green.300", "green.700")
  const borderColorNeg = useColorModeValue("red.100", "red.800")

  return (
    <Card w="full" border=".5px solid" borderColor={prop.percentchangetype === "pos" ? borderColorPos : borderColorNeg}>
      <CardBody display="flex" flexFlow="column nowrap" pos={"relative"}>
        <Text fontSize="5xl" fontWeight="light" color={color} lineHeight={"initial"} display="inline-flex" alignItems="center">
          {prop.totalamount}
        </Text>
        <Heading fontSize="lg" mb="6px" textTransform="capitalize" mt={"auto"}>
          {prop.title}
        </Heading>
        <Text as="span" fontSize="xs" fontWeight="normal" color={labelColor} casing="uppercase" display="inline-flex" alignItems="center" gap={1}>
          {prop.percentchangetype === "pos" ? (
            <Text as="span" color="green.400" fontWeight="bold" display="inline-flex" alignItems="center" gap={1}>
              <TriangleUpIcon /> {prop.percentchange}%
            </Text>
          ) : (
            <Text as="span" color="red.400" fontWeight="bold" display="inline-flex" alignItems="center" gap={1}>
              <TriangleDownIcon />
              {prop.percentchange}%
            </Text>
          )}
          {" "}
          {prop.percentlabel}
        </Text>
        {/* {prop.icon} */}
      </CardBody>
    </Card>
  )
}

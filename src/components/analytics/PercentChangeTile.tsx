import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons"
import {Card, Text, useColorModeValue, CardBody, Heading} from "@chakra-ui/react"
import React from "react"
import {priceHelper} from "utils"

interface PercentChangeTileProps {
  previousAmount: number
  currentAmount: number
  title: string
  label: string
  icon: any
  isMoney?: boolean
}
export default function PercentChangeTile({
  previousAmount,
  currentAmount,
  title,
  label,
  isMoney = true
}: PercentChangeTileProps) {
  const color = useColorModeValue("blackAlpha.500", "whiteAlpha.500")
  const labelColor = useColorModeValue("blackAlpha.400", "whiteAlpha.500")
  const borderColorPos = useColorModeValue("green.300", "green.700")
  const borderColorNeg = useColorModeValue("red.100", "red.800")
  const percentchange = Math.round(((currentAmount - previousAmount) / previousAmount) * 100)
  const percentchangetype = percentchange >= 0 ? "pos" : "neg"

  const percentChangeDisplay = (
    <Text
      as="span"
      fontSize="xs"
      fontWeight="normal"
      color={labelColor}
      casing="uppercase"
      display="inline-flex"
      alignItems="center"
      gap={1}
    >
      <Text
        as="span"
        color={percentchangetype === "pos" ? "green.400" : "red.400"}
        fontWeight="bold"
        display="inline-flex"
        alignItems="center"
        gap={1}
      >
        <TriangleUpIcon /> {percentchange}%
      </Text>
      {" " + label}
    </Text>
  )
  return (
    <Card w="full" border=".5px solid" borderColor={percentchangetype === "pos" ? borderColorPos : borderColorNeg}>
      <CardBody display="flex" flexFlow="column nowrap" pos={"relative"}>
        <Text
          fontSize="5xl"
          fontWeight="light"
          color={color}
          lineHeight={"initial"}
          display="inline-flex"
          alignItems="center"
        >
          {isMoney ? priceHelper.formatShortPrice(currentAmount) : currentAmount}
        </Text>
        <Heading fontSize="lg" mb="6px" mt={"auto"}>
          {title}
        </Heading>
        {!Number.isNaN(percentchange) &&
          percentchange !== Number.POSITIVE_INFINITY &&
          percentchange !== Number.NEGATIVE_INFINITY &&
          percentChangeDisplay}
      </CardBody>
    </Card>
  )
}

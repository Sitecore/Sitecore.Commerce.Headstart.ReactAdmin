import {Avatar, Flex, Icon, Text, useColorModeValue} from "@chakra-ui/react"
import React from "react"
import {HiOutlineClock} from "react-icons/hi"

export function ItemContent(props) {
  const navbarIcon = useColorModeValue("gray.500", "gray.200")
  const notificationColor = useColorModeValue("gray.700", "white")
  const spacing = " "
  return (
    <>
      <Avatar name={props.aName} src={props.aSrc} borderRadius="12px" me="16px" />
      <Flex flexDirection="column" gap={1}>
        <Text fontSize="14px" color={notificationColor}>
          <Text fontWeight="bold" fontSize="14px" as="span">
            {props.boldInfo}
            {spacing}
          </Text>
          {props.info}
        </Text>
        <Flex alignItems="center" gap={1}>
          <Icon as={HiOutlineClock} />
          <Text fontSize="xs" lineHeight="100%" color={navbarIcon}>
            {props.time}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

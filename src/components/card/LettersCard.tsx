import {Avatar, Badge, Box, HStack, Text} from "@chakra-ui/react"
import {TbUser} from "react-icons/tb"

export default function LettersCard(props) {
  var str = new String(props.FirstName)
  var strlast = new String(props.LastName)
  const firstnameletter = str.charAt(0)
  const lastnameletter = strlast.charAt(0)
  return (
    <Avatar
      icon={<TbUser fontSize="1.5rem" />}
      size="md"
      name={`${firstnameletter} ${lastnameletter}}`}
      bg="accent.500"
    />
  )
}

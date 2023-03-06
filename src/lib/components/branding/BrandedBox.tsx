import {useColorMode, useColorModeValue, Box, Button, Tooltip} from "@chakra-ui/react"
import {FiMinus, FiPlus} from "react-icons/fi"

interface BrandedBoxProperties {
  mt?: number
  mb?: number
  children: JSX.Element
  setExpanded?: (boolean) => void
  isExpaned?: boolean
}

export default function BrandedBox({children, mt, mb, isExpaned, setExpanded}: BrandedBoxProperties) {
  const {colorMode, toggleColorMode} = useColorMode()
  const bgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")
  const shadow = "5px 5px 5px #999999"
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")

  return (
    <Box mt={mt} mb={mb} p={6} w={"full"} boxShadow={shadow} rounded={"lg"} zIndex={1} color={color} bg={bgColor}>
      <Tooltip label={isExpaned ? "Click to Collapse Details" : "Click to Expand Details"}>
        <Button
          mt={-8}
          mx={-3}
          aria-label="Expand"
          size={"xxs"}
          onClick={() => {
            setExpanded(!isExpaned)
          }}
        >
          {isExpaned !== undefined ? !isExpaned ? <FiPlus /> : <FiMinus /> : null}
        </Button>
      </Tooltip>
      {children}
    </Box>
  )
}

import {Box, Flex, Text, IconButton, useStyleConfig} from "@chakra-ui/react"

import {useEffect, useState} from "react"
import {HiOutlineMinusSm, HiOutlinePlusSm} from "react-icons/hi"
function Card(props) {
  const {variant, closedText, children, ...rest} = props
  const styles = useStyleConfig("Card", {variant})
  const [isShownPanel, setIsShownPanel] = useState(true)
  const [isShownButton, setIsShownButton] = useState(false)
  const inClosedText = closedText ?? "Panel is closed"

  useEffect(() => {
    if (props.showclosebutton !== undefined) {
      if (props.showclosebutton === "false") {
        setIsShownButton(true)
      }
    }
  }, [props.showclosebutton])

  const handlePanelClick = (event) => {
    // toggle shown state
    setIsShownPanel((current) => !current)
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      __css={styles}
      {...rest}
      pt="2"
      pb="2"
      mb="6"
      shadow="xl"
      w="100%"
      width="full"
      position="relative"
      _hover={{
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      <IconButton
        variant="closePanelButton"
        aria-label="close panel"
        icon={isShownPanel ? <HiOutlineMinusSm /> : <HiOutlinePlusSm />}
        onClick={handlePanelClick}
        hidden={isShownButton}
      ></IconButton>
      {isShownPanel && (
        <Flex flexDirection="column" p="GlobalPadding" mt="6">
          {children}
        </Flex>
      )}
      {isShownPanel == false && (
        <Flex p="5">
          <Text fontSize="20px" fontWeight="600" pb="20px" color="gray.300">
            {inClosedText}
          </Text>
        </Flex>
      )}
    </Box>
  )
}

export default Card

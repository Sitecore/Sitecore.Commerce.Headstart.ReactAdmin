import {VStack, useMediaQuery, Flex} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"

import MobileSideBarMenu from "./MobileSideBarMenu"
import DesktopSideBarMenu from "./DesktopSideBarMenu"

const SideNavigation = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  return (
    <Flex
      pos="sticky"
      top="0px"
      left="2"
      h="95vh"
      borderRadius={{
        xl: "30px",
        lg: "30px",
        md: "30px",
        sm: "15px",
        base: "15px"
      }}
      w={{
        xl: "250px",
        lg: "250px",
        md: "250px",
        sm: "75px",
        base: "75px"
      }}
      flexDir="column"
      justifyContent="flex-start"
    >
      <VStack justifyContent="flex-start">{isMobile ? <MobileSideBarMenu /> : <DesktopSideBarMenu />}</VStack>
    </Flex>
  )
}

export default SideNavigation

import { VStack, useMediaQuery, Flex } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

import MobileSideBarMenu from "./MobileSideBarMenu"
import DesktopSideBarMenu from "./DesktopSideBarMenu"

const SideNavigation = () => {
  return (
    <DesktopSideBarMenu />
    // TODO: I'd prefer to just use one sidebar component, and make it responsive.
    // <>
    //   {isMobile ? <MobileSideBarMenu /> : <DesktopSideBarMenu />}
    // </>
  )
}

export default SideNavigation

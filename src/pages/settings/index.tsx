import {Card, Container, Icon, Text, Grid, CardBody} from "@chakra-ui/react"
import {HiOutlineFilter, HiUsers, HiLockClosed, HiUserGroup} from "react-icons/hi"
import {FaAddressBook} from "react-icons/fa"
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "config/app-permissions.config"
import {Link} from "@chakra-ui/next-js"

export const settingsPageItems = [
  {
    label: "Security Profiles",
    path: "/settings/securityprofiles",
    icon: HiLockClosed,
    permisshies: [appPermissions.SecurityProfileViewer, appPermissions.SecurityProfileManager]
  },
  {
    label: "Admin Users",
    path: "/settings/adminusers",
    icon: HiUsers,
    permisshies: [appPermissions.AdminUserViewer, appPermissions.AdminUserManager]
  },
  {
    label: "Admin User Groups",
    path: "/settings/adminusergroups",
    icon: HiUserGroup,
    permisshies: [appPermissions.AdminUserGroupViewer, appPermissions.AdminUserGroupManager]
  },
  {
    label: "Admin Addresses",
    path: "/settings/adminaddresses",
    icon: FaAddressBook,
    permisshies: [appPermissions.AdminAddressViewer, appPermissions.AdminAddressManager]
  },
  {
    label: "Product Facets",
    path: "/settings/productfacets",
    icon: HiOutlineFilter,
    permisshies: [appPermissions.ProductFacetViewer, appPermissions.ProductFacetManager]
  }
]

const SettingsPage = () => {
  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <NextSeo title="Settings" />
      <Grid gridTemplateColumns="repeat(auto-fit, 225px)" gap={4}>
        {settingsPageItems.map((item) => (
          <ProtectedContent key={item.path} hasAccess={item.permisshies}>
            <Link href={item.path} _hover={{textDecoration: "none"}}>
              <Card align="center" variant="levitating">
                <CardBody
                  display="flex"
                  flexFlow="column nowrap"
                  gap={4}
                  alignItems="center"
                  h={"225px"}
                  justifyContent={"center"}
                >
                  <Icon as={item.icon} fontSize="5xl" title="Settings" color="darkGray"></Icon>
                  <Text width="100%" w="full">
                    {item.label}
                  </Text>
                </CardBody>
              </Card>
            </Link>
          </ProtectedContent>
        ))}
      </Grid>
    </Container>
  )
}

const ProtectedSettingsPage = () => {
  return (
    <ProtectedContent hasAccess={settingsPageItems.map((item) => item.permisshies).flat()}>
      <SettingsPage />
    </ProtectedContent>
  )
}

export default ProtectedSettingsPage

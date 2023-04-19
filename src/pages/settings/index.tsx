import {Card, Container, Icon, Text, useColorModeValue, Grid, GridItem, Box, CardBody} from "@chakra-ui/react"
import {HiOutlineFilter, HiUsers} from "react-icons/hi"
import {FaAddressBook} from "react-icons/fa"
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"
import {Link} from "components/navigation/Link"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Settings",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const SettingsPage = () => {
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")
  const boxBgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <NextSeo title="Settings" />
      <Grid gridTemplateColumns="repeat(auto-fit, 225px)" gap={4}>
        <Link href="/settings/adminusers/" _hover={{textDecoration: "none"}}>
          <Card align="center" variant="levitating">
            <CardBody
              display="flex"
              flexFlow="column nowrap"
              gap={4}
              alignItems="center"
              h={"225px"}
              justifyContent={"center"}
            >
              <Icon as={HiUsers} fontSize="5xl" title="Settings" color="darkGray"></Icon>
              <Text width="100%" w="full">
                Admin Users
              </Text>
            </CardBody>
          </Card>
        </Link>

        <Link href="/settings/adminaddresses/" _hover={{textDecoration: "none"}}>
          <Card align="center" variant="levitating">
            <CardBody
              display="flex"
              flexFlow="column nowrap"
              gap={4}
              alignItems="center"
              h={"225px"}
              justifyContent={"center"}
            >
              <Icon as={FaAddressBook} fontSize="5xl" title="Settings" color="darkGray"></Icon>
              <Text width="100%" w="full">
                Admin Addresses
              </Text>
            </CardBody>
          </Card>
        </Link>

        <Link href="/settings/productfacets/" _hover={{textDecoration: "none"}}>
          <Card align="center" variant="levitating">
            <CardBody
              display="flex"
              flexFlow="column nowrap"
              gap={4}
              alignItems="center"
              h={"225px"}
              justifyContent={"center"}
            >
              <Icon as={HiOutlineFilter} fontSize="5xl" title="Settings" color="darkGray"></Icon>
              <Text width="100%" w="full">
                Product Facets
              </Text>
            </CardBody>
          </Card>
        </Link>
      </Grid>
    </Container>
  )
}

const ProtectedSettingsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <SettingsPage />
    </ProtectedContent>
  )
}

export default ProtectedSettingsPage

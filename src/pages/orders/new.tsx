import {Button, Card, CardBody, Container, FormControl, FormLabel, HStack, Input} from "@chakra-ui/react"
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "New Order",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const NewOrdersPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Order" />
      <Card>
        <CardBody>
          <HStack justifyContent="space-between" w="100%">
            <FormControl>
              <FormLabel>Buyer</FormLabel>
              <Input type="text" />
              <FormLabel>Product(s)</FormLabel>
              <Input type="text" />
            </FormControl>
          </HStack>
          <HStack justifyContent="space-between" w="100%">
            <Button variant="outline">Cancel</Button>
            <Button> Submit</Button>
          </HStack>
        </CardBody>
      </Card>
    </Container>
  )
}

const ProtectedNewOrdersPage = () => (
  <ProtectedContent hasAccess={appPermissions.OrderManager}>
    <NewOrdersPage />
  </ProtectedContent>
)

export default ProtectedNewOrdersPage

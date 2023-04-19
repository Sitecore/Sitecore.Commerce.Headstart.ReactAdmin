import {Button, Container, FormControl, FormLabel, HStack, Input} from "@chakra-ui/react"
import Card from "components/card/Card"
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"

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
      <Card variant="primaryCard">
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

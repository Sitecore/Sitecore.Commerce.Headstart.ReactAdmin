import {Button, Container, FormControl, FormLabel, HStack, Input} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import Card from "components/card/Card"
import {appPermissions} from "constants/app-permissions.config"
import {NextSeo} from "next-seo"

import React from "react"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "New Return",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const NewReturnPage = () => {
  return (
    <Container maxW="full">
      <NextSeo title="New Return" />
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
          <Button variant="secondaryButton">Cancel</Button>
          <Button> Submit</Button>
        </HStack>
      </Card>
    </Container>
  )
}

const ProtectedNewReturnPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <NewReturnPage />
    </ProtectedContent>
  )
}

export default ProtectedNewReturnPage

import {Box, Button, HStack} from "@chakra-ui/react"
import ExportToCsv from "components/demo/ExportToCsv"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import BuyerList from "@/components/buyers/list/BuyerList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Buyers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedBuyersList = () => {
  let router = useRouter()
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <BuyerList />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyersList

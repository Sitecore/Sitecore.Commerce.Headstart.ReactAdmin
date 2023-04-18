import {Box, Button, ButtonGroup, HStack, Icon, Text} from "@chakra-ui/react"
import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUsersList from "@/components/buyerursers/list/BuyerUsersList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Users List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UsersList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return (
    <Box padding="GlobalPadding">
      <BuyerUsersList buyerid={buyerid}></BuyerUsersList>
    </Box>
  )
}

export default UsersList

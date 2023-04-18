import {Box} from "@chakra-ui/react"
import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUserGroupList from "@/components/buyerusergroups/list/BuyerUserGroupList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "User groups List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UserGroupsList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return (
    <>
      <Box padding="GlobalPadding">
        <BuyerUserGroupList buyerid={buyerid}></BuyerUserGroupList>
      </Box>
    </>
  )
}

export default UserGroupsList

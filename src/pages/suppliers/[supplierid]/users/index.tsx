import {Box} from "@chakra-ui/react"
import React from "react"
import {useRouter} from "hooks/useRouter"
import SupplierUsersList from "@/components/supplierursers/list/SupplierUsersList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Users List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UsersList = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return (
    <>
      <Box padding="GlobalPadding">
        <SupplierUsersList supplierid={supplierID}></SupplierUsersList>
      </Box>
    </>
  )
}

export default UsersList

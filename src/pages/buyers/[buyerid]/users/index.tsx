import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUserList from "@/components/buyerusers/list/BuyerUserList"

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

  return <BuyerUserList buyerid={buyerid} />
}

export default UsersList

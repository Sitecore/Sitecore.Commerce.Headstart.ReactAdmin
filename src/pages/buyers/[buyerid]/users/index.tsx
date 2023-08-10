import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUserList from "@/components/buyerusers/list/BuyerUserList"

const UsersList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerUserList buyerid={buyerid} />
}

export default UsersList

import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerUserGroupList from "@/components/buyerusergroups/list/BuyerUserGroupList"

const UserGroupsList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerUserGroupList buyerid={buyerid} />
}

export default UserGroupsList

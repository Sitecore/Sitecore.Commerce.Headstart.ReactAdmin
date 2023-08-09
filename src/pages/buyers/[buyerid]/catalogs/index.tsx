import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerCatalogsList from "@/components/buyercatalogs/list/BuyerCatalogsList"

const CatalogsList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerCatalogsList buyerid={buyerid} />
}

export default CatalogsList

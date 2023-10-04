import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerCatalogsList from "@/components/buyercatalogs/list/BuyerCatalogsList"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const CatalogsList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerCatalogsList buyerid={buyerid} />
}

const ProtectedCatalogsList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager]}>
      <CatalogsList />
    </ProtectedContent>
  )
}

export default ProtectedCatalogsList

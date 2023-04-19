import React from "react"
import {useRouter} from "hooks/useRouter"
import BuyerCatalogsList from "@/components/buyercatalogs/list/BuyerCatalogsList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Catalogs List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CatalogsList = () => {
  const router = useRouter()
  const buyerid = router.query.buyerid as string

  return <BuyerCatalogsList buyerid={buyerid} />
}

export default CatalogsList

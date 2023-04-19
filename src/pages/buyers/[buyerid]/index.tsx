import {Buyer, Buyers} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

import {Box} from "@chakra-ui/react"
import {CreateUpdateForm} from "components/buyers"
import {IBuyer} from "types/ordercloud/IBuyer"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"

/* This declare the page title and enable the breadcrumbs in the content header section. */
/* TODO Ask if this is the way to go or better to have getStaticProps + GetStaticPath in this case */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit buyer",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const BuyerListItem = () => {
  const router = useRouter()
  const [buyer, setBuyer] = useState({} as Buyer)
  useEffect(() => {
    if (router?.query?.buyerid) {
      Buyers?.Get<IBuyer>(router?.query?.buyerid as string).then((buyer) => setBuyer(buyer))
    }
  }, [router.query.buyerid])
  return <>{buyer?.ID ? <CreateUpdateForm buyer={buyer} /> : <div> Loading</div>}</>
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <BuyerListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

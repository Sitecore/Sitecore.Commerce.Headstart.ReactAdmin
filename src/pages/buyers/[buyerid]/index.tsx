import {Buyer, Buyers} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {BuyerForm} from "components/buyers"
import {IBuyer} from "types/ordercloud/IBuyer"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

const BuyerListItem = () => {
  const router = useRouter()
  const [buyer, setBuyer] = useState({} as Buyer)
  useEffect(() => {
    if (router?.query?.buyerid) {
      Buyers?.Get<IBuyer>(router?.query?.buyerid as string).then((buyer) => setBuyer(buyer))
    }
  }, [router.query.buyerid])
  return (
    <>
      {buyer?.ID ? (
        <BuyerForm buyer={buyer} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <BuyerListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

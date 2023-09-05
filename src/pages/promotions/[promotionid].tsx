import {useEffect, useState} from "react"
import {PromotionForm} from "../../components/promotions/PromotionForm"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IPromotion} from "types/ordercloud/IPromotion"

const PromotionItem = (props) => {
  const router = useRouter()
  const [promotion, setPromotion] = useState({} as Promotion)
  useEffect(() => {
    const getPromotion = async () => {
      const promo = await Promotions.Get<IPromotion>(router.query.promotionid as string)
      setPromotion(promo)
    }
    if (router.query.promotionid) {
      getPromotion()
    }
  }, [router.query.promotionid])
  console.log(promotion)
  return (
    <>
      {promotion?.ID ? (
        <PromotionForm promotion={promotion} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedPromotionItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.PromotionViewer, appPermissions.PromotionManager]}>
      <PromotionItem />
    </ProtectedContent>
  )
}

export default ProtectedPromotionItem

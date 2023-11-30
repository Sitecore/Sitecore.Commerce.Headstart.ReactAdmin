import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {PromotionDetail} from "@/components/promotions/detail/PromotionDetail"
import {usePromotionDetail} from "hooks/usePromoDetail"
import {PromotionDetailSkeleton} from "@/components/promotions/detail/PromotionDetailSkeleton"

const NewPromotionDetailPage = () => {
  const promotionDetailProps = usePromotionDetail()

  if (promotionDetailProps.loading) {
    return <PromotionDetailSkeleton />
  }

  return <PromotionDetail {...promotionDetailProps} />
}

const ProtectedNewPromotionDetailPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.PromotionManager}>
      <NewPromotionDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedNewPromotionDetailPage

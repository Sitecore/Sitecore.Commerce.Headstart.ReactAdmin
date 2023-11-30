import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {PromotionDetail} from "@/components/promotions/detail/PromotionDetail"
import {usePromotionDetail} from "hooks/usePromoDetail"
import {PromotionDetailSkeleton} from "@/components/promotions/detail/PromotionDetailSkeleton"

const PromotionDetailPage = () => {
  const promotionDetailProps = usePromotionDetail()

  if (promotionDetailProps.loading) {
    return <PromotionDetailSkeleton />
  }
  return <PromotionDetail {...promotionDetailProps} />
}

const ProtectedPromotionDetailPage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.PromotionViewer, appPermissions.PromotionManager]}>
      <PromotionDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedPromotionDetailPage

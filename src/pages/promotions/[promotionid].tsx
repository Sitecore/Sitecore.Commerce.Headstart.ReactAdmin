import {useEffect, useState} from "react"
import {CreateUpdateForm} from "../../lib/components/promotions/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import {Promotion} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {promotionsService} from "../../lib/api"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Update promotion",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const PromotionItem = (props) => {
  const router = useRouter()
  const [promotion, setPromotion] = useState({} as Promotion)
  useEffect(() => {
    if (router.query.promotionid) {
      promotionsService.getById(router.query.promotionid).then((promotion) => setPromotion(promotion))
    }
  }, [router.query.promotionid])
  console.log(promotion)
  return <>{promotion?.ID ? <CreateUpdateForm promotion={promotion} /> : <div> Loading</div>}</>
}

const ProtectedPromotionItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Box padding="GlobalPadding">
        <PromotionItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedPromotionItem

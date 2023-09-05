import {Container} from "@chakra-ui/react"
import BuyerContextSwitch from "components/buyers/BuyerContextSwitch"
import {Breadcrumbs} from "../navigation/Breadcrumbs"
import SupplierContextSwitch from "components//suppliers/SupplierContextSwitch"
import {useRouter} from "hooks/useRouter"

const ContentHeader = () => {
  const router = useRouter()
  const path = router.asPath

  return (
    <Container px={[4, 6, 8]} pt={[6, 8, 10]} bg={"st.mainBackgroundColor"} maxW="100%">
      {path !== "/dashboard" && path !== "/" && <Breadcrumbs />}
      {path.startsWith("/buyers") && router.query.buyerid && <BuyerContextSwitch />}
      {path.startsWith("/suppliers") && router.query.supplierid && <SupplierContextSwitch />}
    </Container>
  )
}

export default ContentHeader

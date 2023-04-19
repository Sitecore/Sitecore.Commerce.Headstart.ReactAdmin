import {Container} from "@chakra-ui/react"
import BuyerContextSwitch from "components/buyers/BuyerContextSwitch"
import {Breadcrumbs} from "../navigation/Breadcrumbs"

const ContentHeader = (props) => {
  return props.header ? (
    <Container px={[4, 6, 8]} pt={[6, 8, 10]} bg={"st.mainBackgroundColor"} maxW="100%">
      {props?.header?.metas?.hasBreadcrumbs && <Breadcrumbs />}
      {props?.header?.metas?.hasBuyerContextSwitch && <BuyerContextSwitch />}
    </Container>
  ) : null
}

export default ContentHeader

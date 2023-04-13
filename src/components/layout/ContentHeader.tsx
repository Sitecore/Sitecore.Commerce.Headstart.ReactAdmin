import { Container } from "@chakra-ui/react"
import BuyerContextSwitch from "components/buyers/BuyerContextSwitch"
import { Breadcrumbs } from "../navigation/Breadcrumbs"

const ContentHeader = (props) => {
  return props.header ? (
    <Container px={[4, 6, 8]} py="3" bgColor="blackAlpha.200" maxW="100%">
      {props?.header?.metas?.hasBreadcrumbs && (
        <Breadcrumbs />
      )}
      {/* {props?.header?.title && <Heading as="h1">{props?.header?.title}</Heading>} */}
      {props?.header?.metas?.hasBuyerContextSwitch && <BuyerContextSwitch />}
    </Container>
  ) : null
}

export default ContentHeader

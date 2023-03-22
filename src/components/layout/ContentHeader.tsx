import {Box, Container, Heading, VStack} from "@chakra-ui/react"
import BuyerContextSwitch from "components/buyers/BuyerContextSwitch"
import {Breadcrumbs} from "../navigation/Breadcrumbs"

const ContentHeader = (props) => {
  return props.header ? (
    <Container maxW="100%" mb={8} pt={5}>
      {props?.header?.metas?.hasBreadcrumbs && (
        <Box mb={3}>
          <Breadcrumbs />
        </Box>
      )}
      {props?.header?.title && <Heading as="h1">{props?.header?.title}</Heading>}
      {props?.header?.metas?.hasBuyerContextSwitch && <BuyerContextSwitch />}
    </Container>
  ) : null
}

export default ContentHeader

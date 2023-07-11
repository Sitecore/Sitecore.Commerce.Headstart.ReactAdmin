import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Code,
  Heading,
  HStack,
  Image,
  Text
} from "@chakra-ui/react"
import {isUndefined} from "lodash"
import Link from "next/link"
import {Product} from "ordercloud-javascript-sdk"
import {FC, useMemo} from "react"
import {textHelper} from "utils/text.utils"
import {IDefaultResource, ListViewTemplate} from "../ListView/ListView"

interface IDefaultDataGridItemCard {
  o: IDefaultResource
  i: number
  actions?: (itemData: IDefaultResource) => ListViewTemplate
  isSelected?: boolean
  onSelectChange?: (id: string, isSelected: boolean) => void
  hrefResolver?: (itemData: IDefaultResource) => string
}
const DefaultDataGridItemCard: FC<IDefaultDataGridItemCard> = ({
  o,
  i,
  actions,
  isSelected,
  onSelectChange,
  hrefResolver
}) => {
  const mainDisplay = useMemo(() => {
    if (o.Name) {
      return o.Name
    }
    if (o.FirstName && o.LastName) {
      return `${o.FirstName} ${o.LastName}`
    }
    return o.ID
  }, [o])

  const cardBody = useMemo(() => {
    return (
      <>
        <Heading as="h3" fontSize="lg">
          <Code m={0} mb={1}>
            {o.ID}
          </Code>
          <Text as="span" noOfLines={1}>
            {mainDisplay}
          </Text>
        </Heading>
        {!isUndefined(o.Active) && (
          <Badge variant={"solid"} fontSize="xxs" colorScheme={o.Active ? "success" : "danger"}>
            {o.Active ? "Active" : "Inactive"}
          </Badge>
        )}
      </>
    )
  }, [mainDisplay, o])

  return (
    <Card h="100%" pos="relative">
      <CardHeader
        bg="white"
        display="flex"
        pb={0}
        flexFlow="row nowrap"
        justifyContent="space-between"
        alignItems={"start"}
        borderTopRadius={"md"}
      >
        <Checkbox
          borderColor={"blackAlpha.300"}
          isChecked={isSelected}
          onChange={(e) => onSelectChange(o.ID, e.target.checked)}
        />

        <Box mt={-3} mr={-3} pl={3}>
          {actions && actions(o)}
        </Box>
      </CardHeader>
      {hrefResolver ? (
        <Link passHref href={hrefResolver(o)}>
          <CardBody as="a" textAlign="center">
            {cardBody}
          </CardBody>
        </Link>
      ) : (
        <CardBody as="a" textAlign="center">
          {cardBody}
        </CardBody>
      )}
    </Card>
  )
}

export default DefaultDataGridItemCard

import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack
} from "@chakra-ui/react"
import {Buyer, Buyers, Catalogs, UserGroups, Users} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {IBuyer} from "types/ordercloud/IBuyer"
import {useRouter} from "hooks/useRouter"
import {TbUser} from "react-icons/tb"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import ProtectedContent from "../auth/ProtectedContent"

export default function BuyerContextSwitch({...props}) {
  const [currentBuyer, setCurrentBuyer] = useState({} as Buyer)
  const [buyers, setBuyers] = useState([] as Buyer[])
  const [buyersMeta, setBuyersMeta] = useState({})
  const router = useRouter()
  const buyerid = router.query.buyerid.toString()
  const canViewBuyerUsers = useHasAccess([appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager])
  const canViewBuyerUserGroups = useHasAccess([
    appPermissions.BuyerUserGroupViewer,
    appPermissions.BuyerUserGroupManager
  ])
  const canViewBuyerCatalogs = useHasAccess([appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager])

  useEffect(() => {
    async function initBuyersData() {
      const buyersList = await Buyers.List<IBuyer>()
      setBuyers(buyersList.Items)
    }
    initBuyersData()
  }, [])

  useEffect(() => {
    if (buyers.length > 0 && buyerid) {
      const _currentBuyer = buyers.find((buyer) => buyer.ID === buyerid)
      setCurrentBuyer(_currentBuyer)
    }
  }, [buyerid, buyers])

  useEffect(() => {
    const getCurrentBuyerMeta = async (buyerId: string) => {
      if (!buyerId) {
        return
      }
      const requests = []
      requests.push(canViewBuyerUsers ? Users.List(buyerId) : null)
      requests.push(canViewBuyerUserGroups ? UserGroups.List(buyerId) : null)
      requests.push(canViewBuyerCatalogs ? Catalogs.ListAssignments({buyerID: buyerId}) : null)
      const responses = await Promise.all(requests)

      setBuyersMeta({
        UserCount: canViewBuyerUsers && responses[0].Meta.TotalCount,
        UserGroupCount: canViewBuyerUserGroups && responses[1].Meta.TotalCount,
        CatalogCount: canViewBuyerCatalogs && responses[2].Meta.TotalCount
      })
    }
    getCurrentBuyerMeta(currentBuyer.ID)
  }, [currentBuyer, canViewBuyerUsers, canViewBuyerUserGroups, canViewBuyerCatalogs])

  return (
    <Card mt={6}>
      <CardBody display="flex" flexWrap={"wrap"} alignItems={"center"} gap={4}>
        <Avatar
          src={`https://robohash.org/${buyerid}.png`}
          size="lg"
          icon={<TbUser fontSize="1.5rem" />}
          bgColor="gray.100"
          name={currentBuyer?.Name}
          shadow="sm"
          borderRadius="full"
        />
        <VStack alignItems={"center"}>
          <Text
            fontSize="lg"
            casing="capitalize"
            lineHeight="1"
            fontWeight="bold"
            ms={{sm: "8px", md: "0px"}}
            width="100%"
          >
            {currentBuyer?.Name}
          </Text>
          <Text fontSize="sm" lineHeight="1" color="gray.400" width="100%">
            {currentBuyer?.ID}
          </Text>
        </VStack>

        {typeof router.query.userid == "undefined" &&
          typeof router.query.usergroupid == "undefined" &&
          buyers.filter((b) => b.ID !== currentBuyer.ID).length > 1 && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {currentBuyer?.Name}
              </MenuButton>
              <MenuList>
                {buyers
                  .filter((b) => b.ID !== currentBuyer.ID)
                  .map((buyer) => (
                    <MenuItem key={buyer.ID} minH="40px" onClick={() => router.push({query: {buyerid: buyer.ID}})}>
                      <Image
                        boxSize="2rem"
                        borderRadius="full"
                        src={`https://robohash.org/${buyer.ID}.png`}
                        alt={buyer.Name}
                        mr="12px"
                      />
                      <span>{buyer.Name}</span>
                    </MenuItem>
                  ))}
              </MenuList>
            </Menu>
          )}
        <ButtonGroup ml="auto" flexWrap="wrap" gap={2}>
          <ProtectedContent hasAccess={[appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager]}>
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/users`)}
              variant="outline"
              style={{margin: 0}}
            >
              Users ({buyersMeta["UserGroupCount"] || "-"})
            </Button>
          </ProtectedContent>
          <ProtectedContent hasAccess={[appPermissions.BuyerUserGroupViewer, appPermissions.BuyerUserGroupManager]}>
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups`)}
              variant="outline"
              style={{margin: 0}}
            >
              User Groups ({buyersMeta["UserCount"] || "-"})
            </Button>
          </ProtectedContent>
          <ProtectedContent hasAccess={[appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager]}>
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
              variant="outline"
              style={{margin: 0}}
            >
              Catalogs ({buyersMeta["CatalogCount"] || "-"})
            </Button>
          </ProtectedContent>
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}

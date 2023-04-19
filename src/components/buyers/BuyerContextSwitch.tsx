import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack
} from "@chakra-ui/react"
import {Buyer, Buyers, Catalogs, UserGroups, Users} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

import {ChevronDownIcon} from "@chakra-ui/icons"
import {IBuyer} from "types/ordercloud/IBuyer"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import {useRouter} from "hooks/useRouter"
import {TbUser} from "react-icons/tb"

export default function BuyerContextSwitch({...props}) {
  const [currentBuyer, setCurrentBuyer] = useState({} as Buyer)
  const [buyers, setBuyers] = useState([])
  const [buyersMeta, setBuyersMeta] = useState({})
  const router = useRouter()
  const buyerid = router.query.buyerid.toString()

  useEffect(() => {
    initBuyersData()
  }, [])

  useEffect(() => {
    if (buyers.length > 0 && buyerid) {
      const _currentBuyer = buyers.find((buyer) => buyer.ID === buyerid)
      setCurrentBuyer(_currentBuyer)
    }
  }, [buyerid, buyers])

  async function initBuyersData() {
    let _buyerListMeta = {}
    const buyersList = await Buyers.List<IBuyer>()
    setBuyers(buyersList.Items)
    const requests = buyersList.Items.map(async (buyer) => {
      const [userGroupsList, usersList, catalogsList] = await Promise.all([
        UserGroups.List<IBuyerUserGroup>(buyer.ID),
        Users.List<IBuyerUser>(buyer.ID),
        Catalogs.ListAssignments({buyerID: buyer.ID})
      ])
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["userGroupsCount"] = userGroupsList.Meta.TotalCount
      _buyerListMeta[buyer.ID]["usersCount"] = usersList.Meta.TotalCount
      _buyerListMeta[buyer.ID]["catalogsCount"] = catalogsList.Meta.TotalCount
    })
    await Promise.all(requests)
    setBuyersMeta(_buyerListMeta)
  }

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
          buyers.length > 1 && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {currentBuyer?.Name}
              </MenuButton>
              <MenuList>
                {buyers.map((buyer, index) => (
                  <>
                    <MenuItem key={index} minH="40px" onClick={() => router.push({query: {buyerid: buyer.ID}})}>
                      <Image
                        boxSize="2rem"
                        borderRadius="full"
                        src={`https://robohash.org/${buyer.ID}.png`}
                        alt={buyer.Name}
                        mr="12px"
                      />
                      <span>{buyer.Name}</span>
                    </MenuItem>
                  </>
                ))}
              </MenuList>
            </Menu>
          )}
        <ButtonGroup ml="auto" flexWrap="wrap" gap={2}>
          <Button
            onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups`)}
            variant="outline"
            style={{margin: 0}}
          >
            User Groups ({buyersMeta[buyerid]?.userGroupsCount || "-"})
          </Button>
          <Button
            onClick={() => router.push(`/buyers/${router.query.buyerid}/users`)}
            variant="outline"
            style={{margin: 0}}
          >
            Users ({buyersMeta[buyerid]?.usersCount || "-"})
          </Button>
          <Button
            onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
            variant="outline"
            style={{margin: 0}}
          >
            Catalogs ({buyersMeta[buyerid]?.catalogsCount || "-"})
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}

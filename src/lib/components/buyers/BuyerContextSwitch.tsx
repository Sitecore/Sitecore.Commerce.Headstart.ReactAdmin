import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
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
import {buyersService, catalogsService, userGroupsService, usersService} from "lib/api"
import {useEffect, useState} from "react"

import {Buyer} from "ordercloud-javascript-sdk"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {useRouter} from "next/router"

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
    const buyersList = await buyersService.list()
    setBuyers(buyersList.Items)
    const requests = buyersList.Items.map(async (buyer) => {
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["userGroupsCount"] = await userGroupsService.getUserGroupsCountByBuyerID(buyer.ID)
      _buyerListMeta[buyer.ID]["usersCount"] = await usersService.getUsersCountByBuyerID(buyer.ID)
      _buyerListMeta[buyer.ID]["catalogsCount"] = await catalogsService.getCatalogsCountByBuyerID(buyer.ID)
    })
    await Promise.all(requests)
    setBuyersMeta(_buyerListMeta)
  }

  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        pl="GlobalPadding"
        pr="GlobalPadding"
        pt="2"
        pb="2"
        mb="6"
        shadow="xl"
        w="100%"
        width="full"
        position="relative"
        _hover={{
          textDecoration: "none",
          borderRadius: "10px"
        }}
      >
        <HStack maxWidth="100%" my={{sm: "14px"}} justifyContent="space-between" w="100%">
          <HStack>
            <Avatar
              me={{md: "22px"}}
              src={`https://robohash.org/${buyerid}.png`}
              w="80px"
              h="80px"
              borderRadius="15px"
            />
            <VStack textAlign="left">
              <Text fontSize={{sm: "lg", lg: "xl"}} fontWeight="bold" ms={{sm: "8px", md: "0px"}} width="100%">
                {currentBuyer?.Name}
              </Text>
              <Text fontSize={{sm: "sm", md: "md"}} color="gray.400" width="100%">
                {currentBuyer?.ID}
              </Text>
            </VStack>
            <Spacer width="40px"></Spacer>
            {buyers.length > 1 && (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="lg" ml="30px">
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
          </HStack>

          <Flex direction={{sm: "column", lg: "row"}} w={{sm: "100%", md: "50%", lg: "auto"}}>
            <ButtonGroup>
              <Button
                onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups`)}
                variant="secondaryButton"
              >
                User Groups ({buyersMeta[buyerid]?.userGroupsCount || "-"})
              </Button>
              <Button onClick={() => router.push(`/buyers/${router.query.buyerid}/users`)} variant="secondaryButton">
                Users ({buyersMeta[buyerid]?.usersCount || "-"})
              </Button>
              <Button onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)} variant="secondaryButton">
                Catalogs ({buyersMeta[buyerid]?.catalogsCount || "-"})
              </Button>
            </ButtonGroup>
          </Flex>
        </HStack>
      </Box>
    </>
  )
}

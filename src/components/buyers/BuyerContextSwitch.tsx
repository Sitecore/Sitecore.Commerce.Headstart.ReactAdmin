import {Avatar, Button, ButtonGroup, Card, CardBody, Image, MenuItem, Text, VStack} from "@chakra-ui/react"
import {Buyer, Buyers, Catalogs, UserGroups, Users} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {useRouter} from "hooks/useRouter"
import {TbUser} from "react-icons/tb"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import ProtectedContent from "../auth/ProtectedContent"
import {AsyncSelect} from "chakra-react-select"
import {ReactSelectOption} from "types/form/ReactSelectOption"
import {IBuyer} from "types/ordercloud/IBuyer"

export default function BuyerContextSwitch({...props}) {
  const [currentBuyer, setCurrentBuyer] = useState({} as Buyer)
  const [buyersMeta, setBuyersMeta] = useState({
    UserCount: null,
    UserGroupCount: null,
    CatalogCount: null
  })
  const router = useRouter()
  const buyerid = router.query.buyerid.toString()
  const canViewBuyerUsers = useHasAccess([appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager])
  const canViewBuyerUserGroups = useHasAccess([
    appPermissions.BuyerUserGroupViewer,
    appPermissions.BuyerUserGroupManager
  ])
  const canViewBuyerCatalogs = useHasAccess([appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager])

  useEffect(() => {
    const fetchCurrentBuyer = async () => {
      const _currentBuyer = await Buyers.Get(buyerid)
      setCurrentBuyer(_currentBuyer)
    }
    if (buyerid) {
      fetchCurrentBuyer()
    }
  }, [buyerid])

  const loadBuyers = async (inputValue: string) => {
    if (!currentBuyer) return
    const buyerList = await Buyers.List<IBuyer>({
      search: inputValue,
      pageSize: 10,
      filters: {ID: `!${currentBuyer.ID}`}
    })
    return buyerList.Items.map((buyer) => ({
      label: (
        <MenuItem key={buyer.ID} minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src={`https://robohash.org/${buyer.ID}.png`}
            alt={buyer.Name}
            mr="12px"
          />
          <span>{buyer.Name}</span>
        </MenuItem>
      ),
      value: buyer.ID
    }))
  }

  const handleBuyerChange = (option: ReactSelectOption) => {
    router.push({query: {buyerid: option.value}})
  }

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

        {typeof router.query.userid == "undefined" && typeof router.query.usergroupid == "undefined" && (
          <AsyncSelect<ReactSelectOption, false>
            value={{value: currentBuyer.ID, label: currentBuyer.Name}}
            loadOptions={loadBuyers}
            defaultOptions
            isMulti={false}
            colorScheme="accent"
            placeholder="Select buyer..."
            onChange={handleBuyerChange}
            hideSelectedOptions={true}
            chakraStyles={{
              container: (baseStyles) => ({...baseStyles, minWidth: 250})
            }}
          />
        )}
        <ButtonGroup ml="auto" flexWrap="wrap" gap={2}>
          <ProtectedContent hasAccess={[appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager]}>
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/users`)}
              variant="outline"
              style={{margin: 0}}
            >
              Users ({buyersMeta.UserCount ?? "-"})
            </Button>
          </ProtectedContent>
          <ProtectedContent hasAccess={[appPermissions.BuyerUserGroupViewer, appPermissions.BuyerUserGroupManager]}>
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups`)}
              variant="outline"
              style={{margin: 0}}
            >
              User Groups ({buyersMeta.UserGroupCount ?? "-"})
            </Button>
          </ProtectedContent>
          <ProtectedContent hasAccess={[appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager]}>
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
              variant="outline"
              style={{margin: 0}}
            >
              Catalogs ({buyersMeta.CatalogCount ?? "-"})
            </Button>
          </ProtectedContent>
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}

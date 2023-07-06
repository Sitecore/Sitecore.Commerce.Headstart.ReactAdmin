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
import {useEffect, useState} from "react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Supplier, SupplierAddresses, Suppliers, SupplierUserGroups, SupplierUsers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import {ISupplier} from "types/ordercloud/ISupplier"
import {TbUser} from "react-icons/tb"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"

export default function SupplierContextSwitch({...props}) {
  const [currentSupplier, setCurrentSupplier] = useState({} as Supplier)
  const [suppliers, setSuppliers] = useState([])
  const [suppliersMeta, setSuppliersMeta] = useState({})
  const router = useRouter()
  const supplierid = router.query.supplierid.toString()

  useEffect(() => {
    initSuppliersData()
  }, [])

  useEffect(() => {
    if (suppliers.length > 0 && supplierid) {
      const _currentSupplier = suppliers.find((supplier) => supplier.ID === supplierid)
      setCurrentSupplier(_currentSupplier)
    }
  }, [supplierid, suppliers])

  async function initSuppliersData() {
    let _supplierListMeta = {}
    const suppliersList = await Suppliers.List<ISupplier>()
    setSuppliers(suppliersList.Items)
    const requests = suppliersList.Items.map(async (supplier, index) => {
      const [userGroupsList, usersList, addressList] = await Promise.all([
        SupplierUserGroups.ListUserAssignments(supplier.ID),
        SupplierUsers.List<ISupplierUser>(supplier.ID),
        SupplierAddresses.List<ISupplierAddress>(supplier.ID)
      ])
      _supplierListMeta[supplier.ID] = {}
      _supplierListMeta[supplier.ID]["userGroupsCount"] = userGroupsList.Meta.TotalCount
      _supplierListMeta[supplier.ID]["usersCount"] = usersList.Meta.TotalCount
      _supplierListMeta[supplier.ID]["addressesCount"] = addressList.Meta.TotalCount
      //_supplierListMeta[supplier.ID]["key"] = index
    })
    await Promise.all(requests)
    setSuppliersMeta(_supplierListMeta)
  }

  return (
    <>
      <Card mt={6}>
        <CardBody display="flex" flexWrap={"wrap"} alignItems={"center"} gap={4}>
          <Avatar
            src={`https://robohash.org/${supplierid}.png`}
            size="lg"
            icon={<TbUser fontSize="1.5rem" />}
            bgColor="gray.100"
            name={currentSupplier?.Name}
            shadow="sm"
            borderRadius="full"
          />
          <VStack alignItems="center">
            <Text
              fontSize="lg"
              casing="capitalize"
              lineHeight="1"
              fontWeight="bold"
              ms={{sm: "8px", md: "0px"}}
              width="100%"
            >
              {currentSupplier?.Name}
            </Text>
            <Text fontSize="sm" lineHeight="1" color="gray.400" width="100%">
              {currentSupplier?.ID}
            </Text>
          </VStack>

          {suppliers.length > 1 && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="lg" ml="30px">
                {currentSupplier?.Name}
              </MenuButton>
              <MenuList>
                {suppliers.map((supplier, index) => (
                  <MenuItem key={index} minH="40px" onClick={() => router.push({query: {supplierid: supplier.ID}})}>
                    <Image
                      boxSize="2rem"
                      borderRadius="full"
                      src={`https://robohash.org/${supplier.ID}.png`}
                      alt={supplier.Name}
                      mr="12px"
                    />
                    <span>{supplier.Name}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
          <ButtonGroup ml="auto" flexWrap="wrap" gap={2}>
            <Button onClick={() => router.push(`/suppliers/${router.query.supplierid}/usergroups`)} variant="outline">
              User Groups ({suppliersMeta[supplierid]?.userGroupsCount || "-"})
            </Button>
            <Button onClick={() => router.push(`/suppliers/${router.query.supplierid}/users`)} variant="outline">
              Users ({suppliersMeta[supplierid]?.usersCount || "-"})
            </Button>
            <Button onClick={() => router.push(`/suppliers/${router.query.supplierid}/addresses`)} variant="outline">
              Addresses ({suppliersMeta[supplierid]?.addressesCount || "-"})
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card>
    </>
  )
}

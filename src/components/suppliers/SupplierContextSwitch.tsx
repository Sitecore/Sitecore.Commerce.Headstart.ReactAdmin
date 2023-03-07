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
import {useEffect, useState} from "react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {Supplier, Suppliers, SupplierUserGroups, SupplierUsers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import {ISupplier} from "types/ordercloud/ISupplier"

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
    const requests = suppliersList.Items.map(async (supplier) => {
      const [userGroupsList, usersList] = await Promise.all([
        SupplierUserGroups.ListUserAssignments(supplier.ID),
        SupplierUsers.List<ISupplierUser>(supplier.ID)
      ])
      _supplierListMeta[supplier.ID] = {}
      _supplierListMeta[supplier.ID]["userGroupsCount"] = userGroupsList.Meta.TotalCount
      _supplierListMeta[supplier.ID]["usersCount"] = usersList.Meta.TotalCount
    })
    await Promise.all(requests)
    setSuppliersMeta(_supplierListMeta)
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
              src={`https://robohash.org/${supplierid}.png`}
              w="80px"
              h="80px"
              borderRadius="15px"
            />
            <VStack textAlign="left">
              <Text fontSize={{sm: "lg", lg: "xl"}} fontWeight="bold" ms={{sm: "8px", md: "0px"}} width="100%">
                {currentSupplier?.Name}
              </Text>
              <Text fontSize={{sm: "sm", md: "md"}} color="gray.400" width="100%">
                {currentSupplier?.ID}
              </Text>
            </VStack>
            <Spacer width="40px"></Spacer>
            {suppliers.length > 1 && (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="lg" ml="30px">
                  {currentSupplier?.Name}
                </MenuButton>
                <MenuList>
                  {suppliers.map((supplier, index) => (
                    <>
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
                    </>
                  ))}
                </MenuList>
              </Menu>
            )}
          </HStack>

          <Flex direction={{sm: "column", lg: "row"}} w={{sm: "100%", md: "50%", lg: "auto"}}>
            <ButtonGroup>
              <Button
                onClick={() => router.push(`/suppliers/${router.query.supplierid}/usergroups`)}
                variant="secondaryButton"
              >
                User Groups ({suppliersMeta[supplierid]?.userGroupsCount || "-"})
              </Button>
              <Button
                onClick={() => router.push(`/suppliers/${router.query.supplierid}/users`)}
                variant="secondaryButton"
              >
                Users ({suppliersMeta[supplierid]?.usersCount || "-"})
              </Button>
              <Button
                onClick={() => router.push(`/suppliers/${router.query.supplierid}/catalogs`)}
                variant="secondaryButton"
              >
                Catalogs ({suppliersMeta[supplierid]?.catalogsCount || "-"})
              </Button>
            </ButtonGroup>
          </Flex>
        </HStack>
      </Box>
    </>
  )
}

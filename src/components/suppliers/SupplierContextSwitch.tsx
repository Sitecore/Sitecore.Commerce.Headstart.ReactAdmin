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
import {ISupplier} from "types/ordercloud/ISupplier"
import {TbUser} from "react-icons/tb"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import ProtectedContent from "../auth/ProtectedContent"

export default function SupplierContextSwitch({...props}) {
  const [currentSupplier, setCurrentSupplier] = useState({} as Supplier)
  const [suppliers, setSuppliers] = useState([] as Supplier[])
  const [suppliersMeta, setSuppliersMeta] = useState({
    UserCount: null,
    UserGroupCount: null,
    AddressCount: null
  })
  const router = useRouter()
  const supplierid = router.query.supplierid.toString()
  const canViewSupplierUsers = useHasAccess([appPermissions.SupplierUserViewer, appPermissions.SupplierUserManager])
  const canViewSupplierUserGroups = useHasAccess([
    appPermissions.SupplierUserGroupViewer,
    appPermissions.SupplierUserGroupManager
  ])
  const canViewSupplierAddresses = useHasAccess([
    appPermissions.SupplierAddressViewer,
    appPermissions.SupplierAddressManager
  ])

  useEffect(() => {
    async function initSuppliersData() {
      const suppliersList = await Suppliers.List<ISupplier>()
      setSuppliers(suppliersList.Items)
    }
    initSuppliersData()
  }, [])

  useEffect(() => {
    if (suppliers.length > 0 && supplierid) {
      const _currentSupplier = suppliers.find((supplier) => supplier.ID === supplierid)
      setCurrentSupplier(_currentSupplier)
    }
  }, [supplierid, suppliers])

  useEffect(() => {
    const getCurrentSupplierMeta = async (supplierId: string) => {
      if (!supplierId) {
        return
      }
      const requests = []
      requests.push(canViewSupplierUsers ? SupplierUsers.List(supplierId) : null)
      requests.push(canViewSupplierUserGroups ? SupplierUserGroups.List(supplierId) : null)
      requests.push(canViewSupplierAddresses ? SupplierAddresses.List(supplierId) : null)
      const responses = await Promise.all(requests)

      setSuppliersMeta({
        UserCount: canViewSupplierUsers && responses[0].Meta.TotalCount,
        UserGroupCount: canViewSupplierUserGroups && responses[1].Meta.TotalCount,
        AddressCount: canViewSupplierAddresses && responses[2].Meta.TotalCount
      })
    }
    getCurrentSupplierMeta(currentSupplier.ID)
  }, [currentSupplier, canViewSupplierUsers, canViewSupplierUserGroups, canViewSupplierAddresses])

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

          {suppliers.filter((s) => s.ID !== currentSupplier.ID).length > 1 && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="lg" ml="30px">
                {currentSupplier?.Name}
              </MenuButton>
              <MenuList>
                {suppliers
                  .filter((s) => s.ID !== currentSupplier.ID)
                  .map((supplier, index) => (
                    <MenuItem
                      key={supplier.ID}
                      minH="40px"
                      onClick={() => router.push({query: {supplierid: supplier.ID}})}
                    >
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
            <ProtectedContent hasAccess={[appPermissions.SupplierUserViewer, appPermissions.SupplierUserManager]}>
              <Button onClick={() => router.push(`/suppliers/${router.query.supplierid}/users`)} variant="outline">
                Users ({suppliersMeta.UserCount ?? "-"})
              </Button>
            </ProtectedContent>
            <ProtectedContent
              hasAccess={[appPermissions.SupplierUserGroupViewer, appPermissions.SupplierUserGroupManager]}
            >
              <Button onClick={() => router.push(`/suppliers/${router.query.supplierid}/usergroups`)} variant="outline">
                User Groups ({suppliersMeta.UserGroupCount ?? "-"})
              </Button>
            </ProtectedContent>
            <ProtectedContent hasAccess={[appPermissions.SupplierAddressViewer, appPermissions.SupplierAddressManager]}>
              <Button onClick={() => router.push(`/suppliers/${router.query.supplierid}/addresses`)} variant="outline">
                Addresses ({suppliersMeta.AddressCount ?? "-"})
              </Button>
            </ProtectedContent>
          </ButtonGroup>
        </CardBody>
      </Card>
    </>
  )
}

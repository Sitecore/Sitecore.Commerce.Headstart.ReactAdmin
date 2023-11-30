import {Avatar, Button, ButtonGroup, Card, CardBody, Image, MenuItem, Text, VStack} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import {SupplierAddresses, Suppliers, SupplierUserGroups, SupplierUsers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {ISupplier} from "types/ordercloud/ISupplier"
import {TbUser} from "react-icons/tb"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import ProtectedContent from "../auth/ProtectedContent"
import {AsyncSelect} from "chakra-react-select"
import {ReactSelectOption} from "types/form/ReactSelectOption"

export default function SupplierContextSwitch({...props}) {
  const [currentSupplier, setCurrentSupplier] = useState({} as ISupplier)
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
    const fetchCurrentSupplier = async () => {
      const _currentSupplier = await Suppliers.Get(supplierid)
      setCurrentSupplier(_currentSupplier)
    }
    if (supplierid) {
      fetchCurrentSupplier()
    }
  }, [supplierid])

  const loadSuppliers = async (inputValue: string) => {
    if (!currentSupplier) return
    const supplierList = await Suppliers.List<ISupplier>({
      search: inputValue,
      pageSize: 10,
      filters: {ID: `!${currentSupplier.ID}`}
    })
    return supplierList.Items.map((supplier) => ({
      label: (
        <MenuItem key={supplier.ID} minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src={`https://robohash.org/${supplier.ID}.png`}
            alt={supplier.Name}
            mr="12px"
          />
          <span>{supplier.Name}</span>
        </MenuItem>
      ),
      value: supplier.ID
    }))
  }

  const handleSupplierChange = (option: ReactSelectOption) => {
    router.push({query: {supplierid: option.value}})
  }

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

          <AsyncSelect<ReactSelectOption, false>
            value={{value: currentSupplier.ID, label: currentSupplier.Name}}
            loadOptions={loadSuppliers}
            defaultOptions
            isMulti={false}
            colorScheme="accent"
            placeholder="Select supplier..."
            onChange={handleSupplierChange}
            hideSelectedOptions={true}
            chakraStyles={{
              container: (baseStyles) => ({...baseStyles, minWidth: 250})
            }}
          />
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

import {useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {Address, AdminAddresses} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {AddressForm} from "@/components/addresses"

const AdminAddressListItem = () => {
  const router = useRouter()
  const [adminAddress, setAdminAddress] = useState({} as Address)
  useEffect(() => {
    const getAdminAddress = async () => {
      const address = await AdminAddresses.Get<IAdminAddress>(router.query.adminaddressid as string)
      setAdminAddress(address)
    }
    if (router.query.adminaddressid) {
      getAdminAddress()
    }
  }, [router.query.adminaddressid])
  return (
    <>
      {adminAddress?.ID ? (
        <AddressForm address={adminAddress} addressType="admin" />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedAdminAddressListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.AdminAddressViewer, appPermissions.AdminAddressManager]}>
      <AdminAddressListItem />
    </ProtectedContent>
  )
}

export default ProtectedAdminAddressListItem

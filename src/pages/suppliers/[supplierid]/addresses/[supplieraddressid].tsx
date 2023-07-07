import {useEffect, useState} from "react"
import {CreateUpdateForm} from "components/supplieraddresses"
import {Box, Container, Skeleton} from "@chakra-ui/react"
import {Address, SupplierAddresses} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"

export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit supplier address",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const SupplierAddressListItem = () => {
  const router = useRouter()
  const [supplierAddress, setSupplierAddress] = useState({} as Address)
  useEffect(() => {
    const getSupplierAddress = async () => {
      const address = await SupplierAddresses.Get<ISupplierAddress>(
        router.query.supplierid as string,
        router.query.supplieraddressid as string
      )
      setSupplierAddress(address)
    }
    if (router.query.supplieraddressid) {
      getSupplierAddress()
    }
  }, [router.query.supplierid, router.query.supplieraddressid])
  return (
    <>
      {supplierAddress?.ID ? (
        <CreateUpdateForm address={supplierAddress} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedSupplierAddressListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <SupplierAddressListItem />
    </ProtectedContent>
  )
}

export default ProtectedSupplierAddressListItem

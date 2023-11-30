import {AddressForm} from "@/components/addresses"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

function ProtectedNewSupplierAddressPage() {
  const router = useRouter()
  if (!router.isReady) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierAddressManager}>
      <AddressForm addressType="supplier" parentId={router.query.supplierid.toString()} />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierAddressPage

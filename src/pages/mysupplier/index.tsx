import {useEffect, useState} from "react"
import {SupplierForm} from "components/suppliers"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {Me, Supplier, Suppliers} from "ordercloud-javascript-sdk"
import {appPermissions} from "config/app-permissions.config"
import {ISupplier} from "types/ordercloud/ISupplier"

const SupplierListItem = () => {
  const [supplier, setSupplier] = useState({} as Supplier)
  useEffect(() => {
    const getSupplier = async () => {
      const me = await Me.Get()
      const supplier = await Suppliers.Get<ISupplier>(me.Supplier.ID)
      setSupplier(supplier)
    }
    getSupplier()
  }, [])
  return (
    <>
      {supplier?.ID ? (
        <SupplierForm supplier={supplier} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="344px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SupplierViewer, appPermissions.SupplierManager]}>
      <SupplierListItem />
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

import {useCallback, useEffect, useState} from "react"
import {SupplierForm} from "components/suppliers"
import {Container, Skeleton} from "@chakra-ui/react"
import {SecurityProfileAssignment, SecurityProfiles, Suppliers} from "ordercloud-javascript-sdk"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {ISupplier} from "types/ordercloud/ISupplier"
import useHasAccess from "hooks/useHasAccess"
import ProtectedContent from "@/components/auth/ProtectedContent"

const SupplierListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [supplier, setSupplier] = useState({} as ISupplier)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (supplierId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const assignmentsList = await SecurityProfiles.ListAssignments({supplierID: supplierId, level: "Company"})
      const assignments = assignmentsList.Items
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getSupplier = useCallback(async (supplierId: string) => {
    const _supplier = await Suppliers.Get<ISupplier>(supplierId)
    setSupplier(_supplier)
    return _supplier
  }, [])

  const initialize = useCallback(
    async function (supplierId: string) {
      await Promise.all([getSupplier(supplierId), getSecurityProfileAssignments(supplierId)])
      setLoading(false)
    },
    [getSupplier, getSecurityProfileAssignments]
  )
  useEffect(() => {
    if (router.query.supplierid) {
      initialize(router.query.supplierid as string)
    }
  }, [router.query.supplierid, initialize])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <SupplierForm
      supplier={supplier}
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(supplier.ID)}
    />
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

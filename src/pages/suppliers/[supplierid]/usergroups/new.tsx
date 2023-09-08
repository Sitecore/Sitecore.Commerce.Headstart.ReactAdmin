import {UserGroupFormForm} from "@/components/usergroups"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {useRouter} from "next/router"
import {SecurityProfileAssignment, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"

const ProtectedSupplierUserGroupPage = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])
  useEffect(() => {
    const getSecurityProfileAssignments = async () => {
      if (!isSecurityProfileManager) {
        setLoading(false)
        return
      }
      const assignmentList = await SecurityProfiles.ListAssignments({
        level: "Company",
        commerceRole: "Supplier",
        supplierID: router.query.supplierid.toString()
      })
      setSecurityProfileAssignments(assignmentList.Items)
      setLoading(false)
    }
    if (router.query.supplierid) {
      getSecurityProfileAssignments()
    }
  }, [router.query.supplierid, isSecurityProfileManager])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }

  return (
    <ProtectedContent hasAccess={appPermissions.SupplierUserGroupManager}>
      <UserGroupFormForm
        userGroupType="supplier"
        parentId={router.query.supplierid as string}
        securityProfileAssignments={securityProfileAssignments}
      />
    </ProtectedContent>
  )
}

export default ProtectedSupplierUserGroupPage

import {UserForm} from "@/components/users"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {SecurityProfileAssignment, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"

function ProtectedNewAdminUserPage() {
  const [loading, setLoading] = useState(true)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)

  useEffect(() => {
    const getSecurityProfileAssignments = async () => {
      if (!isSecurityProfileManager) {
        setLoading(false)
        return
      }
      const assignmentList = await SecurityProfiles.ListAssignments({level: "Company", commerceRole: "Seller"})
      setSecurityProfileAssignments(assignmentList.Items)
      setLoading(false)
    }
    getSecurityProfileAssignments()
  }, [isSecurityProfileManager])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <ProtectedContent hasAccess={appPermissions.AdminUserManager}>
      <UserForm userType="admin" securityProfileAssignments={securityProfileAssignments} />
    </ProtectedContent>
  )
}

export default ProtectedNewAdminUserPage

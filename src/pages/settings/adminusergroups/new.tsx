import {UserGroupFormForm} from "@/components/usergroups"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {SecurityProfileAssignment, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"

const ProtectedNewUserGroupPage = () => {
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])
  useEffect(() => {
    const getSecurityProfileAssignments = async () => {
      if (!isSecurityProfileManager) {
        return
      }
      const assignmentList = await SecurityProfiles.ListAssignments({
        level: "Company",
        commerceRole: "Seller"
      })
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
    <ProtectedContent hasAccess={appPermissions.AdminUserGroupManager}>
      <UserGroupFormForm userGroupType="admin" securityProfileAssignments={securityProfileAssignments} />
    </ProtectedContent>
  )
}

export default ProtectedNewUserGroupPage
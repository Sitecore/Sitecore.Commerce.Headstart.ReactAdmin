import {UserGroupFormForm} from "@/components/usergroups"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {useRouter} from "next/router"
import {SecurityProfileAssignment, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"

const ProtectedNewUserGroupPage = () => {
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
        commerceRole: "Buyer",
        buyerID: router.query.buyerid.toString()
      })
      setSecurityProfileAssignments(assignmentList.Items)
      setLoading(false)
    }
    if (router.query.buyerid) {
      getSecurityProfileAssignments()
    }
  }, [router.query.buyerid, isSecurityProfileManager])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerUserGroupManager}>
      <UserGroupFormForm
        userGroupType="buyer"
        parentId={router.query.buyerid as string}
        securityProfileAssignments={securityProfileAssignments}
      />
    </ProtectedContent>
  )
}

export default ProtectedNewUserGroupPage

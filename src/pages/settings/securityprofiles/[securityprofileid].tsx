import {useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {SecurityProfile, SecurityProfiles} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {SecurityProfileDetail} from "@/components/security-profiles/detail/SecurityProfileDetail"
import useHasAccess from "hooks/useHasAccess"

const SecurityProfileItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [securityProfile, setSecurityProfile] = useState({} as SecurityProfile)
  const [isAssignedToAllAdmins, setIsAssignedToAllAdmins] = useState(false)

  useEffect(() => {
    const getSecurityProfile = async () => {
      const profile = await SecurityProfiles.Get(router.query.securityprofileid as string)
      if (isSecurityProfileManager) {
        const assignmentsList = await SecurityProfiles.ListAssignments({
          securityProfileID: profile.ID,
          level: "Company",
          commerceRole: "Seller"
        })
        setIsAssignedToAllAdmins(assignmentsList.Items.length > 0)
      }
      setSecurityProfile(profile)
    }
    if (router.query.securityprofileid) {
      getSecurityProfile()
    }
  }, [router.query.securityprofileid, isSecurityProfileManager])
  return (
    <>
      {securityProfile?.ID ? (
        <SecurityProfileDetail securityProfile={securityProfile} isAssignedToAllAdmins={isAssignedToAllAdmins} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedSecurityProfileDetailPage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SecurityProfileViewer, appPermissions.SecurityProfileManager]}>
      <SecurityProfileItem />
    </ProtectedContent>
  )
}

export default ProtectedSecurityProfileDetailPage

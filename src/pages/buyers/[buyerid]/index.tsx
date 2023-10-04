import {Buyer, Buyers, SecurityProfileAssignment, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {BuyerForm} from "components/buyers"
import {IBuyer} from "types/ordercloud/IBuyer"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import useHasAccess from "hooks/useHasAccess"

const BuyerListItem = () => {
  const router = useRouter()
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [loading, setLoading] = useState(true)
  const [buyer, setBuyer] = useState({} as Buyer)
  const [securityProfileAssignments, setSecurityProfileAssignments] = useState([] as SecurityProfileAssignment[])

  const getSecurityProfileAssignments = useCallback(
    async (buyerId: string) => {
      if (!isSecurityProfileManager) {
        return
      }
      const assignmentsList = await SecurityProfiles.ListAssignments({buyerID: buyerId, level: "Company"})
      const assignments = assignmentsList.Items
      setSecurityProfileAssignments(assignments)
      return assignments
    },
    [isSecurityProfileManager]
  )

  const getBuyer = useCallback(async (buyerId: string) => {
    const _buyer = await Buyers.Get<IBuyer>(buyerId)
    setBuyer(_buyer)
    return _buyer
  }, [])

  const initialize = useCallback(
    async function (buyerId: string) {
      await Promise.all([getBuyer(buyerId), getSecurityProfileAssignments(buyerId)])
      setLoading(false)
    },
    [getBuyer, getSecurityProfileAssignments]
  )
  useEffect(() => {
    if (router.query.buyerid) {
      initialize(router.query.buyerid as string)
    }
  }, [router.query.buyerid, initialize])

  if (loading) {
    return (
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Skeleton w="100%" h="544px" borderRadius="md" />
      </Container>
    )
  }
  return (
    <BuyerForm
      buyer={buyer}
      securityProfileAssignments={securityProfileAssignments}
      refresh={() => initialize(buyer.ID)}
    />
  )
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerViewer, appPermissions.BuyerManager]}>
      <BuyerListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

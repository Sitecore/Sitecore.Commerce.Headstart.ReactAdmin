import {User, Users} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {Container, Skeleton} from "@chakra-ui/react"
import {UserForm} from "../../../../components/users/UserForm"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

const UserListItem = () => {
  const router = useRouter()
  const [user, setUser] = useState({} as User)
  useEffect(() => {
    const getUser = async () => {
      const data = await Users.Get<IBuyerUser>(router.query.buyerid as string, router.query.userid as string)
      setUser(data)
    }
    if (router.query.buyerid) {
      getUser()
    }
  }, [router.query.buyerid, router.query.userid])
  return (
    <>
      {user?.ID ? (
        <UserForm user={user} userService={Users} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <UserListItem />
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

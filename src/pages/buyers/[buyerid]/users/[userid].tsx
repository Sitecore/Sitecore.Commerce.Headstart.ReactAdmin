import {useEffect, useState} from "react"
import {CreateUpdateForm} from "../../../../components/users/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {User, Users} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Update user",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

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
  return <>{user?.ID ? <CreateUpdateForm user={user} ocService={Users} /> : <div> Loading</div>}</>
}

const ProtectedBuyerListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <UserListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyerListItem

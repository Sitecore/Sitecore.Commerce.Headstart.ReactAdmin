import {useEffect, useState} from "react"
import {CreateUpdateForm} from "../../../../lib/components/users/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {User} from "ordercloud-javascript-sdk"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"
import {usersService} from "../../../../lib/api"

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
    if (router.query.buyerid) {
      usersService.getById(router.query.buyerid, router.query.userid).then((user) => setUser(user))
    }
  }, [router.query.buyerid, router.query.userid])
  return <>{user?.ID ? <CreateUpdateForm user={user} ocService={usersService} /> : <div> Loading</div>}</>
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

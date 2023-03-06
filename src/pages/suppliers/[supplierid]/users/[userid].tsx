import {useEffect, useState} from "react"
import {CreateUpdateForm} from "../../../../components/users/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {User} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {supplierUsersService} from "../../../../api"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Update user",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: false
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
    if (router.query.supplierid) {
      supplierUsersService.getById(router.query.supplierid, router.query.userid).then((user) => setUser(user))
    }
  }, [router.query.supplierid, router.query.userid])
  return <>{user?.ID ? <CreateUpdateForm user={user} ocService={supplierUsersService} /> : <div> Loading</div>}</>
}

const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <UserListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

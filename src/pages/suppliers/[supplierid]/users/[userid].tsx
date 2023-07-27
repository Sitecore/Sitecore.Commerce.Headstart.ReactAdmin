import {useEffect, useState} from "react"
import {UserForm} from "../../../../components/users/UserForm"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {SupplierUsers, User} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"

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
    const getUser = async () => {
      const data = await SupplierUsers.Get<ISupplierUser>(
        router.query.supplierid as string,
        router.query.userid as string
      )
      setUser(data)
    }
    if (router.query.supplierid) {
      getUser()
    }
  }, [router.query.supplierid, router.query.userid])
  return (
    <>
      {user?.ID ? (
        <UserForm user={user} userService={SupplierUsers} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="544px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <UserListItem />
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

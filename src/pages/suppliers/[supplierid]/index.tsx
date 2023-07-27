import {useEffect, useState} from "react"
import {SupplierForm} from "components/suppliers"
import {Container, Skeleton} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {Supplier, Suppliers} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {ISupplier} from "types/ordercloud/ISupplier"

/* This declare the page title and enable the breadcrumbs in the content header section. */
/* TODO Ask if this is the way to go or better to have getStaticProps + GetStaticPath in this case */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit supplier",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const SupplierListItem = () => {
  const router = useRouter()
  const [supplier, setSupplier] = useState({} as Supplier)
  useEffect(() => {
    const getSupplier = async () => {
      const supplier = await Suppliers.Get<ISupplier>(router.query.supplierid as string)
      setSupplier(supplier)
    }
    if (router.query.supplierid) {
      getSupplier()
    }
  }, [router.query.supplierid])
  return (
    <>
      {supplier?.ID ? (
        <SupplierForm supplier={supplier} />
      ) : (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Skeleton w="100%" h="344px" borderRadius="md" />
        </Container>
      )}
    </>
  )
}

const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierListItem />
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

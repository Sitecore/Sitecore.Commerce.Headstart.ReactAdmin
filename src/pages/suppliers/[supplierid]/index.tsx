import {useEffect, useState} from "react"
import {CreateUpdateForm} from "components/suppliers"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {Supplier, Suppliers} from "ordercloud-javascript-sdk"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
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
          hasSupplierContextSwitch: false
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
  return <>{supplier?.ID ? <CreateUpdateForm supplier={supplier} /> : <div> Loading</div>}</>
}

const ProtectedSupplierListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <SupplierListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedSupplierListItem

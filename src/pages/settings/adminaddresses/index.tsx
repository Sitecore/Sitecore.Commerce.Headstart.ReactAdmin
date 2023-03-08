import {Address, AdminAddresses, ListPage} from "ordercloud-javascript-sdk"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Text
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {Link} from "components/navigation/Link"
import {NextSeo} from "next-seo"
import {OrderCloudTableFilters} from "components/ordercloud-table"
import ProtectedContent from "components/auth/ProtectedContent"
import {addressHelper} from "utils/address.utils"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
import {useSuccessToast} from "hooks/useToast"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Admin Address List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const AdminAddressesPage = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Address>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const adminAddresses = await AdminAddresses.List(filters)
    setTableData(adminAddresses)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteAddress = useCallback(
    async (addressId: string) => {
      await AdminAddresses.Delete(addressId)
      await fetchData({})
      successToast({
        description: "Address deleted successfully"
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/settings/adminaddresses/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "ADDRESS NAME",
        accessor: "AddressName",
        Cell: ({value, row}) => <Link href={`/settings/adminaddresses/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "ADDRESS",
        Cell: ({row}: {row}) => addressHelper.formatOneLineAddress(row.original)
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button
              variant="secondaryButton"
              onClick={() => router.push(`/settings/adminaddresses/${row.original.ID}/`)}
            >
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteAddress(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteAddress, router]
  )

  return (
    <Container maxW="full">
      <NextSeo title="Admin Addresses List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/settings/adminaddresses/add`}>
          <Button variant="primaryButton">New Admin Address</Button>
        </Link>
        <HStack>
          <ExportToCsv />
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData}></DataTable>
      </Card>
    </Container>
  )
}

const ProtectedAdminAddressesPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminAddressesPage />
    </ProtectedContent>
  )
}

export default ProtectedAdminAddressesPage

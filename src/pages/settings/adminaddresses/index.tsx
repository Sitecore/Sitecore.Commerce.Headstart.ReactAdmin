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
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
import {useSuccessToast} from "hooks/useToast"
import {AdminAddresses, Address, ListPage} from "ordercloud-javascript-sdk"
import {addressHelper} from "utils/address.utils"
import {DataTable} from "components/data-table/DataTable"
import {OrderCloudTableFilters} from "components/ordercloud-table"
import {Link} from "components/navigation/Link"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"

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
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const requestExportCSV = () => {}
  const cancelRef = useRef()
  const [tableData, setTableData] = useState(null as ListPage<Address>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const adminAddresses = await AdminAddresses.List<IAdminAddress>(filters)
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
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData}></DataTable>
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Admin Address to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected admin addresses to a CSV, once the export button is clicked behind the scenes a job
                will be kicked off to create the csv and then will automatically download to your downloads folder in
                the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button ref={cancelRef} onClick={() => setExportCSVDialogOpen(false)} variant="secondaryButton">
                  Cancel
                </Button>
                <Button onClick={requestExportCSV}>Export Admin Addresses</Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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

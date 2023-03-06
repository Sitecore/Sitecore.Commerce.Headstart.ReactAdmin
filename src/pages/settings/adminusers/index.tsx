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
  Icon,
  Text
} from "@chakra-ui/react"
import {useCallback, useEffect, useRef, useState, useMemo} from "react"
import Card from "lib/components/card/Card"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useRouter} from "next/router"
import {useSuccessToast} from "lib/hooks/useToast"
import {AdminUsers, ListPage, User} from "ordercloud-javascript-sdk"
import {IoMdClose} from "react-icons/io"
import {MdCheck} from "react-icons/md"
import {OrderCloudTable} from "lib/components/ordercloud-table/OrderCloudTable"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "lib/components/ordercloud-table/models"
import {Link} from "lib/components/navigation/Link"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Admin Users List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const AdminUsersPage = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const cancelRef = useRef()
  const requestExportCSV = () => {}
  const [tableData, setTableData] = useState(null as ListPage<User>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const adminUsersList = await AdminUsers.List(filters)
    setTableData(adminUsersList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteAdminUser = useCallback(
    async (userId: string) => {
      await AdminUsers.Delete(userId)
      await fetchData({})
      successToast({
        description: "User deleted successfully"
      })
    },
    [fetchData, successToast]
  )

  const columns = useMemo(
    (): OrderCloudTableColumn<User>[] => [
      {
        Header: "FIRSTNAME",
        accessor: "FirstName",
        Cell: ({value, row}) => <Link href={`/settings/adminusers/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "LASTNAME",
        accessor: "LastName",
        Cell: ({value, row}) => <Link href={`/settings/adminusers/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "EMAIL",
        accessor: "Email"
      },
      {
        Header: "Active",
        accessor: "Active",
        Cell: ({value}) => (
          <>
            <Icon as={value ? MdCheck : IoMdClose} color={value ? "green.400" : "red.400"} w="20px" h="20px" />
            <Text>{value ? "Active" : "Non active"}</Text>
          </>
        )
      },
      {
        Header: "ACTIONS",
        accessor: "ID",
        Cell: ({value}) => (
          <ButtonGroup>
            <Button variant="secondaryButton" onClick={() => router.push(`/settings/adminusers/${value}/`)}>
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteAdminUser(value)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteAdminUser, router]
  )

  return (
    <Container maxW="full">
      <NextSeo title="Admin Users List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/settings/adminusers/add`}>
          <Button variant="primaryButton">New Admin User</Button>
        </Link>
        <HStack>
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <OrderCloudTable data={tableData} filters={filters} columns={columns} fetchData={fetchData} />
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Admin Users to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected admin users to a CSV, once the export button is clicked behind the scenes a job will
                be kicked off to create the csv and then will automatically download to your downloads folder in the
                browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button ref={cancelRef} onClick={() => setExportCSVDialogOpen(false)} variant="secondaryButton">
                  Cancel
                </Button>
                <Button onClick={requestExportCSV}>Export admin users</Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

const ProtectedAdminUsersPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminUsersPage />
    </ProtectedContent>
  )
}

export default ProtectedAdminUsersPage

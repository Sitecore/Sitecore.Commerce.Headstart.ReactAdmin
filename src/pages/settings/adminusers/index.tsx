import {AdminUsers, ListPage, User} from "ordercloud-javascript-sdk"
import {Button, ButtonGroup, Container, HStack, Icon, Text} from "@chakra-ui/react"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table/models"
import {useCallback, useEffect, useMemo, useState} from "react"

import Card from "components/card/Card"
import ExportToCsv from "components/demo/ExportToCsv"
import {IAdminUser} from "types/ordercloud/IAdminUser"
import {IoMdClose} from "react-icons/io"
import {Link} from "components/navigation/Link"
import {MdCheck} from "react-icons/md"
import {NextSeo} from "next-seo"
import {OrderCloudTable} from "components/ordercloud-table/OrderCloudTable"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"

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
  const [tableData, setTableData] = useState(null as ListPage<User>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const adminUsersList = await AdminUsers.List<IAdminUser>(filters)
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
          <ExportToCsv />
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <OrderCloudTable data={tableData} filters={filters} columns={columns} fetchData={fetchData} />
      </Card>
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

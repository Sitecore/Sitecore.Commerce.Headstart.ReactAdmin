import {Box, Button, ButtonGroup, HStack, Icon, Text} from "@chakra-ui/react"
import {ListPage, Supplier, SupplierUserGroups, SupplierUsers, Suppliers} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useMemo, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {ISupplier} from "types/ordercloud/ISupplier"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"
import {IoMdClose} from "react-icons/io"
import {Link} from "components/navigation/Link"
import {MdCheck} from "react-icons/md"
import {OrderCloudTableFilters} from "components/ordercloud-table"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"
import {dateHelper} from "utils/date.utils"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Suppliers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const SuppliersList = () => {
  let router = useRouter()
  const [suppliersMeta, setSuppliersMeta] = useState({})
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Supplier>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    let _supplierListMeta = {}
    const suppliersList = await Suppliers.List<ISupplier>(filters)
    const requests = suppliersList.Items.map(async (supplier) => {
      const [usersList, userGroupsList] = await Promise.all([
        SupplierUsers.List<ISupplierUser>(supplier.ID),
        SupplierUserGroups.List<ISupplierUserGroup>(supplier.ID)
      ])
      _supplierListMeta[supplier.ID] = {}
      _supplierListMeta[supplier.ID]["usersCount"] = usersList.Meta.TotalCount
      _supplierListMeta[supplier.ID]["userGroupsCount"] = userGroupsList.Meta.TotalCount
    })
    await Promise.all(requests)
    setSuppliersMeta(_supplierListMeta)
    setTableData(suppliersList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteSupplier = useCallback(
    async (supplierId: string) => {
      await Suppliers.Delete(supplierId)
      await fetchData({})
      successToast({
        description: "Supplier deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    () => [
      {
        Header: "SUPPLIER ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/suppliers/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "Name",
        accessor: "Name",
        Cell: ({value, row}) => <Link href={`/suppliers/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "STATUS",
        accessor: "Active",
        Cell: ({row}) => (
          <>
            <Icon
              as={row.original.Active === true ? MdCheck : IoMdClose}
              color={row.original.Active === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
            <Text>{row.original.Active ? "Active" : "Non active"}</Text>
          </>
        )
      },
      {
        Header: "CREATED DATE",
        accessor: "DateCreated",
        Cell: ({value}) => dateHelper.formatDate(value)
      },
      {
        Header: "USER GROUPS / USERS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button onClick={() => router.push(`/suppliers/${row.original.ID}/usergroups`)} variant="outline">
              User Groups ({suppliersMeta[row.original.ID]["userGroupsCount"]})
            </Button>
            <Button onClick={() => router.push(`/suppliers/${row.original.ID}/users`)} variant="outline">
              Users ({suppliersMeta[row.original.ID]["usersCount"]})
            </Button>
          </ButtonGroup>
        )
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button variant="outline" onClick={() => router.push(`/suppliers/${row.original.ID}/`)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => deleteSupplier(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteSupplier, suppliersMeta, router]
  )

  return <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
}

const ProtectedSuppliersList = () => {
  let router = useRouter()
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/suppliers/add`)} variant="solid" colorScheme="primary">
            Create supplier
          </Button>
          <HStack>
            <ExportToCsv />
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <SuppliersList />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedSuppliersList

import {Box, Button, ButtonGroup, HStack, Icon, Text} from "@chakra-ui/react"
import {supplierUserGroupsService, supplierUsersService, suppliersService} from "lib/api"
import {useCallback, useEffect, useMemo, useState} from "react"
import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import {Link} from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import router from "next/router"
import {DataTable} from "lib/components/data-table/DataTable"
import {useSuccessToast} from "lib/hooks/useToast"
import {OrderCloudTableFilters} from "lib/components/ordercloud-table"
import {ListPage, Supplier} from "ordercloud-javascript-sdk"

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
  const [suppliersMeta, setSuppliersMeta] = useState({})
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Supplier>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    let _supplierListMeta = {}
    const suppliersList = await suppliersService.list(filters)

    const requests = suppliersList.Items.map(async (supplier) => {
      _supplierListMeta[supplier.ID] = {}
      _supplierListMeta[supplier.ID]["userGroupsCount"] = await supplierUserGroupsService.getSuppliersUserGroupsCount(
        supplier.ID
      )
      _supplierListMeta[supplier.ID]["usersCount"] = await supplierUsersService.getSuppliersUsersCount(supplier.ID)
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
      await suppliersService.delete(supplierId)
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
            <Button onClick={() => router.push(`/suppliers/${row.original.ID}/usergroups`)} variant="secondaryButton">
              User Groups ({suppliersMeta[row.original.ID]["userGroupsCount"]})
            </Button>
            <Button onClick={() => router.push(`/suppliers/${row.original.ID}/users`)} variant="secondaryButton">
              Users ({suppliersMeta[row.original.ID]["usersCount"]})
            </Button>
          </ButtonGroup>
        )
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button variant="secondaryButton" onClick={() => router.push(`/suppliers/${row.original.ID}/`)}>
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteSupplier(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteSupplier, suppliersMeta]
  )

  return <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
}

const ProtectedSuppliersList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/suppliers/add`)} variant="primaryButton">
            Create supplier
          </Button>
          <HStack>
            <Button variant="secondaryButton">Export CSV</Button>
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

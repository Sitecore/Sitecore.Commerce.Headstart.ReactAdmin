import {Box, Card, Button, ButtonGroup, CardBody, CardHeader, Container, HStack} from "@chakra-ui/react"
import {ListPage, SupplierUserGroups, UserGroup} from "ordercloud-javascript-sdk"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {useCallback, useEffect, useMemo, useState} from "react"

import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {ISupplier} from "types/ordercloud/ISupplier"
import {Link} from "components/navigation/Link"
import React from "react"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"
import ResetButton from "@/components/react-hook-form/reset-button"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "User groups List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UserGroupsList = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<UserGroup>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(
    async (filters: OrderCloudTableFilters) => {
      setFilters(filters)
      const userGroupsList = await SupplierUserGroups.List<ISupplier>(router.query.supplierid as string, filters)
      setTableData(userGroupsList)
    },
    [router.query.supplierid]
  )

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteUserGroup = useCallback(
    async (userGroupid: string) => {
      await SupplierUserGroups.Delete(router.query.supplierid as string, userGroupid)
      await fetchData({})
      successToast({
        description: "Supplier deleted successfully."
      })
    },
    [fetchData, successToast, router.query.supplierid]
  )

  const columnsData = useMemo(
    (): OrderCloudTableColumn<UserGroup>[] => [
      {
        Header: "Name",
        accessor: "Name",
        Cell: ({value, row}) => (
          <Link href={`/suppliers/${router.query.supplierid}/usergroups/${row.original.ID}`}>{value}</Link>
        )
      },
      {
        Header: "DESCRIPTION",
        accessor: "Description"
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button
              variant="outline"
              onClick={() => router.push(`/suppliers/${router.query.supplierid}/usergroups/${row.original.ID}`)}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={() => deleteUserGroup(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteUserGroup, router]
  )

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <HStack justifyContent={"flex-end"} mb={6}>
        <ExportToCsv />
        <Button
          onClick={() => router.push(`/suppliers/${router.query.supplierid}/usergroups/add`)}
          variant="solid"
          colorScheme="primary"
        >
          Create user group
        </Button>
      </HStack>
      <Card>
        <CardBody
          display="flex"
          flexWrap={{base: "wrap", lg: "nowrap"}}
          alignItems={"flex-start"}
          justifyContent="space-between"
          gap={6}
        >
          <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
        </CardBody>
      </Card>
    </Container>
  )
}

export default UserGroupsList

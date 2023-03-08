import {Box, Button, ButtonGroup, HStack, Icon, Text} from "@chakra-ui/react"
import {Buyer, ListPage} from "ordercloud-javascript-sdk"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {useCallback, useEffect, useMemo, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {IoMdClose} from "react-icons/io"
import {Link} from "components/navigation/Link"
import {MdCheck} from "react-icons/md"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"
import {dateHelper} from "utils/date.utils"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"
import {DataTable} from "components/data-table/DataTable"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {ListPage, Buyer, Buyers, Catalogs, UserGroups, Users} from "ordercloud-javascript-sdk"
import {IBuyer} from "types/ordercloud/IBuyer"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Buyers List",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const BuyersList = () => {
  let router = useRouter()
  const [buyersMeta, setBuyersMeta] = useState({})
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Buyer>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    let _buyerListMeta = {}
    const buyersList = await Buyers.List<IBuyer>()
    const requests = buyersList.Items.map(async (buyer) => {
      const [userGroupsList, usersList, catalogsList] = await Promise.all([
        UserGroups.List<IBuyerUserGroup>(buyer.ID),
        Users.List<IBuyerUser>(buyer.ID),
        Catalogs.ListAssignments({buyerID: buyer.ID})
      ])
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["userGroupsCount"] = userGroupsList.Meta.TotalCount
      _buyerListMeta[buyer.ID]["usersCount"] = usersList.Meta.TotalCount
      _buyerListMeta[buyer.ID]["catalogsCount"] = catalogsList.Meta.TotalCount
    })
    await Promise.all(requests)
    setBuyersMeta(_buyerListMeta)
    setTableData(buyersList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteBuyer = useCallback(
    async (userId: string) => {
      await Buyers.Delete(userId)
      fetchData({})
      successToast({
        description: "Buyer deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    (): OrderCloudTableColumn<Buyer>[] => [
      {
        Header: "BUYER ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/buyers/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "Name",
        accessor: "Name",
        Cell: ({value, row}) => <Link href={`/buyers/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "DEFAULT CATALOG ID",
        accessor: "DefaultCatalogID"
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
            <Button onClick={() => router.push(`/buyers/${row.original.ID}/usergroups`)} variant="secondaryButton">
              User Groups ({buyersMeta[row.original.ID]["userGroupsCount"]})
            </Button>
            <Button onClick={() => router.push(`/buyers/${row.original.ID}/users`)} variant="secondaryButton">
              Users ({buyersMeta[row.original.ID]["usersCount"]})
            </Button>
          </ButtonGroup>
        )
      },
      {
        Header: "CATALOGS",
        Cell: ({row}) => (
          <Link href={`/buyers/${row.original.ID}/catalogs`}>
            <Button variant="secondaryButton">Catalogs ({buyersMeta[row.original.ID]["catalogsCount"]})</Button>
          </Link>
        )
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button variant="secondaryButton" onClick={() => router.push(`/buyers/${row.original.ID}/`)}>
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteBuyer(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [buyersMeta, deleteBuyer]
  )

  return <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
}

const ProtectedBuyersList = () => {
  let router = useRouter()
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/buyers/add`)} variant="primaryButton">
            Create buyer
          </Button>
          <HStack>
            <ExportToCsv />
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <BuyersList />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedBuyersList

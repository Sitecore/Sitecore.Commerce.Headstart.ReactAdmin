import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  HStack,
  Switch,
  Tooltip
} from "@chakra-ui/react"
import {Catalog, Catalogs, ListPage} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useMemo, useState} from "react"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {ICatalog} from "types/ordercloud/ICatalog"
import {Link} from "components/navigation/Link"
import {OrderCloudTableFilters} from "components/ordercloud-table"
import React from "react"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Catalogs List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CatalogsList = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Catalog>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const getCatalogsByBuyerId = async (buyerId: string) => {
    const assignments = await Catalogs.ListAssignments({buyerID: buyerId})
    const catalogIds = assignments.Items.map((assignment) => assignment.CatalogID)
    return await Catalogs.List<ICatalog>({filters: {ID: catalogIds.join("|")}})
  }

  const fetchData = useCallback(
    async (filters: OrderCloudTableFilters) => {
      setFilters(filters)
      const catalogsList = await getCatalogsByBuyerId(router.query.buyerid as string)
      setTableData(catalogsList)
    },
    [router.query.buyerid]
  )

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteCatalog = useCallback(
    async (catalogid: string) => {
      await Catalogs.Delete(catalogid)
      fetchData({})
      successToast({
        description: "Buyer deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    () => [
      {
        Header: "Catalog ID",
        accessor: "ID",
        Cell: ({value, row}) => (
          <Link href={`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`}>{value}</Link>
        )
      },
      {
        Header: "Name",
        accessor: "Name"
      },
      {
        Header: "Description",
        accessor: "Description"
      },
      {
        Header: "Active",
        accessor: "Active",
        Cell: ({value, row}) => (
          <>
            <Tooltip label={value ? "Active" : "Non active"} placement="bottom">
              <Switch colorScheme="teal" size="lg" isReadOnly isChecked={value} />
            </Tooltip>
          </>
        )
      },
      {
        Header: "Category Count",
        accessor: "CategoryCount",
        Cell: ({row, value}) => (
          <Link href={`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}/categories`}>
            <Button variant="outline">Categories ({value})</Button>
          </Link>
        )
      },
      {
        Header: "Marketplace",
        accessor: "OwnerID"
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button
              variant="outline"
              onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`)}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={() => deleteCatalog(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteCatalog, router]
  )

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card>
        <CardHeader display="flex" justifyContent="space-between">
          <ExportToCsv />
          <Button
            onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs/add`)}
            variant="solid"
            colorScheme="primary"
          >
            Create Catalog
          </Button>
        </CardHeader>
        <CardBody>
          <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
        </CardBody>
      </Card>
    </Container>
  )
}

export default CatalogsList

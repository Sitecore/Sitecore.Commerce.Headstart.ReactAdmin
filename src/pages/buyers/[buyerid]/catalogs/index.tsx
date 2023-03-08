import {Box, Button, ButtonGroup, HStack, Switch, Tooltip} from "@chakra-ui/react"
import {Catalog, ListPage} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useMemo, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {Link} from "components/navigation/Link"
import {OrderCloudTableFilters} from "components/ordercloud-table"
import React from "react"
import {catalogsService} from "api"
import {useRouter} from "next/router"
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

  const fetchData = useCallback(
    async (filters: OrderCloudTableFilters) => {
      setFilters(filters)
      const catalogsList = await catalogsService.getCatalogsbyBuyerID(router.query.buyerid)
      setTableData(catalogsList)
    },
    [router.query.buyerid]
  )

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteCatalog = useCallback(
    async (catalogid: string) => {
      await catalogsService.delete(catalogid)
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
            <Button variant="secondaryButton">Categories ({value})</Button>
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
              variant="secondaryButton"
              onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs/${row.original.ID}`)}
            >
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteCatalog(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteCatalog, router]
  )

  return (
    <>
      <Box pl="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs/add`)} variant="primaryButton">
            Create catalog
          </Button>
          <HStack>
            <ExportToCsv />
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
        </Card>
      </Box>
    </>
  )
}

export default CatalogsList

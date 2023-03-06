import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons"
import {Button, ButtonGroup, HStack} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useState} from "react"
import Card from "lib/components/card/Card"
import {Link} from "lib/components/navigation/Link"
import React from "react"
import {catalogsService} from "lib/api"
import {useRouter} from "next/router"
import {useSuccessToast} from "lib/hooks/useToast"
import {DataTable} from "lib/components/data-table/DataTable"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "lib/components/ordercloud-table"
import {ListPage, Catalog} from "ordercloud-javascript-sdk"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "All Catalogs",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
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

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const catalogsList = await catalogsService.list(filters)
    setTableData(catalogsList)
  }, [])

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
    (): OrderCloudTableColumn<Catalog>[] => [
      {
        Header: "Name",
        accessor: "Name",
        Cell: ({value, row}) => (
          <Link href={`/buyers/${router.query.buyerid}/usergroups/${row.original.ID}`}>{value}</Link>
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
              variant="secondaryButton"
              onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups/${row.original.ID}`)}
              leftIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteCatalog(row.original.ID)} leftIcon={<DeleteIcon />}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [router, deleteCatalog]
  )

  return (
    <>
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Button
          onClick={() => router.push(`/buyers/${router.query.buyerid}/usergroups/add`)}
          variant="primaryButton"
          leftIcon={<AddIcon />}
          size="lg"
        >
          Create catalog
        </Button>
        <HStack>
          <Button variant="secondaryButton">Export CSV</Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
      </Card>
    </>
  )
}

export default CatalogsList

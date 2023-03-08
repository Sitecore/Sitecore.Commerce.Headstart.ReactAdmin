import {Button, ButtonGroup, Container, HStack, Text} from "@chakra-ui/react"
import {Catalog, ListPage, ProductFacet} from "ordercloud-javascript-sdk"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useErrorToast, useSuccessToast} from "hooks/useToast"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {Link} from "../../../components/navigation/Link"
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {useErrorToast, useSuccessToast} from "hooks/useToast"
import {DataTable} from "components/data-table/DataTable"
import {OrderCloudTableFilters, OrderCloudTableColumn} from "components/ordercloud-table"
import {ListPage, Catalog, ProductFacet, ProductFacets} from "ordercloud-javascript-sdk"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {productfacetsService} from "api/productfacets"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Facets List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductFacetsPage = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<ProductFacet>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const productfacetsList = await ProductFacets.List<IProductFacet>(filters)
    setTableData(productfacetsList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteProductFacet = useCallback(
    async (productfacetid: string) => {
      await ProductFacets.Delete(productfacetid)
      await fetchData({})
      successToast({
        description: "Product Facet deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    (): OrderCloudTableColumn<Catalog>[] => [
      {
        Header: "NAME",
        accessor: "Name",
        Cell: ({value, row}) => <Link href={`/settings/productfacets/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "ID",
        accessor: "ID"
      },
      {
        Header: "FACET OPTIONS",
        accessor: "xp.Options",
        Cell: ({value}) => (value || []).join(", ")
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button
              variant="secondaryButton"
              onClick={() => router.push(`/settings/productfacets/${row.original.ID}/`)}
            >
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteProductFacet(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteProductFacet, router]
  )

  return (
    <Container maxW="full">
      <NextSeo title="Product Facets List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/settings/productfacets/add`}>
          <Button variant="primaryButton">New Product Facet</Button>
        </Link>
        <HStack>
          <ExportToCsv />
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData}></DataTable>
      </Card>
    </Container>
  )
}

const ProtectedProductFacetsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductFacetsPage />
    </ProtectedContent>
  )
}

export default ProtectedProductFacetsPage

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
  Text
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import Card from "lib/components/card/Card"
import {Link} from "../../../lib/components/navigation/Link"
import {NextSeo} from "next-seo"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {productfacetsService} from "lib/api/productfacets"
import {useRouter} from "next/router"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"
import {DataTable} from "lib/components/data-table/DataTable"
import {OrderCloudTableFilters, OrderCloudTableColumn} from "lib/components/ordercloud-table"
import {ListPage, Catalog, ProductFacet} from "ordercloud-javascript-sdk"

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
  const errorToast = useErrorToast()
  const [productfacets, setProductFacets] = useState([])
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const requestExportCSV = () => {}
  const cancelRef = useRef()
  const [tableData, setTableData] = useState(null as ListPage<ProductFacet>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const productfacetsList = await productfacetsService.getAll(filters)
    setTableData(productfacetsList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteProductFacet = useCallback(
    async (productfacetid: string) => {
      await productfacetsService.delete(productfacetid)
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
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData}></DataTable>
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Product Facets to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected product facets to a CSV, once the export button is clicked behind the scense a job
                will be kicked off to create the csv and then will automatically download to your downloads folder in
                the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button ref={cancelRef} onClick={() => setExportCSVDialogOpen(false)} variant="secondaryButton">
                  Cancel
                </Button>
                <Button onClick={requestExportCSV}>Export Product Facets</Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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

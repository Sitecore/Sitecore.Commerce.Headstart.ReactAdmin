import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react"
import {ListPage, OrderReturn, OrderReturns} from "ordercloud-javascript-sdk"
import React, {useCallback, useMemo, useRef} from "react"
import {useEffect, useState} from "react"
import Card from "lib/components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {NextSeo} from "next-seo"
import {dateHelper} from "lib/utils/date.utils"
import {priceHelper} from "lib/utils/price.utils"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {DataTable} from "lib/components/data-table/DataTable"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "lib/components/ordercloud-table"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Returns List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ReturnsPage = () => {
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const requestExportCSV = () => {}
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()
  const [tableData, setTableData] = useState(null as ListPage<OrderReturn>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const returnsList = await OrderReturns.List(filters)
    setTableData(returnsList)
  }, [])

  useEffect(() => {
    fetchData({sortBy: ["DateSubmitted"]})
  }, [fetchData])

  const columnsData = useMemo(
    (): OrderCloudTableColumn<OrderReturn>[] => [
      {
        Header: "ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/returns/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "OrderID",
        accessor: "OrderID",
        Cell: ({value, row}) => <Link href={`/orders/${row.original.OrderID}`}>{value}</Link>
      },
      {
        Header: "DATE CREATED",
        accessor: "DateCreated",
        Cell: ({value}) => dateHelper.formatDate(value)
      },
      {
        Header: "STATUS",
        accessor: "Status"
      },
      {
        Header: "# OF LINE ITEMS",
        Cell: ({row}) => `${row.original.ItemsToReturn?.length}`
      },
      {
        Header: "Refund Amount",
        accessor: "RefundAmount",
        Cell: ({value}) => priceHelper.formatPrice(value)
      }
    ],
    []
  )

  return (
    <Container maxW="full">
      <NextSeo title="Returns" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <HStack>
          <Menu>
            <MenuButton
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              _hover={{bg: "gray.400"}}
              _expanded={{bg: "blue.400"}}
              _focus={{boxShadow: "outline"}}
            >
              Filters <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <VStack>
                  <Text>Returns Status</Text>
                  <CheckboxGroup>
                    <Stack spacing={[1, 3]} direction={["column", "row"]}>
                      <Checkbox value="Completed" defaultChecked>
                        Completed
                      </Checkbox>
                      <Checkbox value="AwaitingApproval" defaultChecked>
                        Awaiting Approval
                      </Checkbox>
                      <Checkbox value="Canceled" defaultChecked>
                        Canceled
                      </Checkbox>
                      <Checkbox value="Declined" defaultChecked>
                        Declined
                      </Checkbox>
                      <Checkbox value="Open" defaultChecked>
                        Open
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                  <Divider />
                </VStack>
              </MenuItem>
            </MenuList>
          </Menu>
          <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
            Export CSV
          </Button>
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
      </Card>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Returns to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the select returns to a CSV, once the export button is clicked behind the scenes a job will be
                kicked off to create the csv and then will automatically download to your downloads folder in the
                browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestExportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Export Returns"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

const ProtectedReturnsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <ReturnsPage />
    </ProtectedContent>
  )
}

export default ProtectedReturnsPage

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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react"
import {ListPage, Order, Orders} from "ordercloud-javascript-sdk"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"

import Card from "components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {IOrder} from "types/ordercloud/IOrder"
import {Link} from "../../components/navigation/Link"
import {NextSeo} from "next-seo"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {dateHelper} from "utils/date.utils"
import {priceHelper} from "utils/price.utils"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Orders List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const OrdersPage = () => {
  const [tableData, setTableData] = useState(null as ListPage<Order>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const ordersList = await Orders.List<IOrder>("All", filters)
    setTableData(ordersList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const columnsData = useMemo(
    (): OrderCloudTableColumn<Order>[] => [
      {
        Header: "ORDER ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/orders/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "DATE SUBMITTED",
        accessor: "DateSubmitted",
        Cell: ({value}) => dateHelper.formatDate(value)
      },
      {
        Header: "STATUS",
        accessor: "Status"
      },
      {
        Header: "CUSTOMER",
        accessor: "FromUserID",
        Cell: ({row}) => `${row.original.FromUser.FirstName} ${row.original.FromUser.LastName}`
      },
      {
        Header: "# OF LINE ITEMS",
        accessor: "LineItemCount"
      },
      {
        Header: "TOTAL",
        accessor: "Total",
        Cell: ({value}) => priceHelper.formatPrice(value)
      }
    ],
    []
  )

  return (
    <Container maxW="full">
      <NextSeo title="Orders List" />
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Link href={`/orders/new`}>
          <Button variant="primaryButton">Create Order</Button>
        </Link>
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
                  <Text>Product Status</Text>
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
                  <HStack></HStack>
                </VStack>
              </MenuItem>
            </MenuList>
          </Menu>
          <ExportToCsv />
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
      </Card>
    </Container>
  )
}

const ProtectedOrdersPage = () => (
  <ProtectedContent hasAccess={appPermissions.OrderManager}>
    <OrdersPage />
  </ProtectedContent>
)

export default ProtectedOrdersPage

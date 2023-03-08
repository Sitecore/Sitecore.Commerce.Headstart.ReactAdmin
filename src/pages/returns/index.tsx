import {
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
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import React, {useCallback, useMemo, useRef} from "react"
import {useEffect, useState} from "react"

import Card from "components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
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
  const [tableData, setTableData] = useState(null as ListPage<OrderReturn>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const returnsList = await OrderReturns.List<IOrderReturn>(filters)
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
          <ExportToCsv />
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
      </Card>
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

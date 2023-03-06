import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Stack,
  Text,
  AlertDialogFooter,
  Spinner
} from "@chakra-ui/react"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import Card from "lib/components/card/Card"
import {IoMdClose} from "react-icons/io"
import {Link} from "lib/components/navigation/Link"
import {MdCheck} from "react-icons/md"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {dateHelper} from "lib/utils/date.utils"
import {promotionsService} from "lib/api"
import router from "next/router"
import {useErrorToast, useSuccessToast} from "lib/hooks/useToast"
import {DataTable} from "lib/components/data-table/DataTable"
import {OrderCloudTableFilters} from "lib/components/ordercloud-table"
import {ListPage, Promotion} from "ordercloud-javascript-sdk"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Promotions List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const PromotionsList = () => {
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Promotion>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const promotionsList = await promotionsService.list(filters)
    setTableData(promotionsList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deletePromotion = useCallback(
    async (promotionId: string) => {
      await promotionsService.delete(promotionId)
      fetchData({})
      successToast({
        description: "Promotion deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    () => [
      {
        Header: "Promotion ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/promotions/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "Name",
        accessor: "Name",
        Cell: ({value, row}) => <Link href={`/promotions/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "Code",
        accessor: "Code"
      },
      {
        Header: "Line Item Level?",
        accessor: "LineItemLevel",
        Cell: ({value}) => (
          <>
            <Icon
              as={value === true ? MdCheck : IoMdClose}
              color={value === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
          </>
        )
      },
      {
        Header: "Can combine?",
        accessor: "CanCombine",
        Cell: ({value}) => (
          <>
            <Icon
              as={value === true ? MdCheck : IoMdClose}
              color={value === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
          </>
        )
      },
      {
        Header: "Allow All Buyers?",
        accessor: "AllowAllBuyers",
        Cell: ({value}) => (
          <>
            <Icon
              as={value === true ? MdCheck : IoMdClose}
              color={value === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
          </>
        )
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
        Cell: ({value}) => dateHelper.formatDate(value)
      },
      {
        Header: "Expiration Date",
        accessor: "Expiration Date",
        Cell: ({value}) => (value ? dateHelper.formatDate(value) : "No Expiration")
      },
      {
        Header: "Redemption Limit",
        Cell: ({row}) => (
          <>
            <Stack direction="row">
              <Badge colorScheme="green">{row.original.RedemptionLimit}</Badge>
              <Badge colorScheme="purpple">{row.original.RedemptionLimitPerUser}</Badge>
              <Badge colorScheme="gray">{row.original.RedemptionLimitCount}</Badge>
            </Stack>
          </>
        )
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button variant="secondaryButton" onClick={() => router.push(`/promotions/${row.original.ID}/`)}>
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deletePromotion(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deletePromotion]
  )

  return <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
}

const ProtectedPromotionsList = () => {
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()
  const requestExportCSV = () => {}

  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/promotions/add`)} variant="primaryButton">
            Create promotion
          </Button>

          <HStack>
            <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
              Export CSV
            </Button>
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <PromotionsList />
        </Card>

        <AlertDialog
          isOpen={isExportCSVDialogOpen}
          onClose={() => setExportCSVDialogOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Export Selected Promotions to CSV
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text display="inline">
                  Export the selected promotions to a CSV, once the export button is clicked behind the scenes a job
                  will be kicked off to create the csv and then will automatically download to your downloads folder in
                  the browser.
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
                    {loading ? <Spinner color="brand.500" /> : "Export Promotions"}
                  </Button>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedPromotionsList

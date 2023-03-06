import {
  Box,
  Container,
  Flex,
  GridItem,
  HStack,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react"
import {HiOutlineCurrencyDollar, HiOutlineFolderOpen, HiOutlineUserAdd, HiOutlineUserCircle} from "react-icons/hi"
import {dashboardService, ordersService, productsService, promotionsService} from "lib/api"
import {useEffect, useState} from "react"
import AverageOrderAmount from "lib/components/analytics/AverageOrderAmount"
import BrandedSpinner from "lib/components/branding/BrandedSpinner"
import Card from "lib/components/card/Card"
import NewClients from "lib/components/analytics/PercentChangeTile"
import {NextSeo} from "next-seo"
import TodaysMoney from "lib/components/analytics/PercentChangeTile"
import TodaysUsers from "lib/components/analytics/PercentChangeTile"
import TotalSales from "lib/components/analytics/PercentChangeTile"
import {appPermissions} from "lib/constants/app-permissions.config"
import {priceHelper} from "lib/utils/price.utils"
import useHasAccess from "lib/hooks/useHasAccess"
import {Link} from "lib/components/navigation/Link"

const Dashboard = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [promotions, setPromotions] = useState([])
  const [users, setUsers] = useState([])

  const [totalTodaysSales, settotalTodaysSales] = useState(Number)
  const [previousTodaysSales, setpreviousTodaysSales] = useState(Number)
  const [percentTodaysSalesChange, setpercentTodaysSalesChange] = useState(String)
  const [totalSales, settotalSales] = useState(Number)
  const [percentSales, setpercentSales] = useState(Number)
  const [percentSalesChange, setpercentSalesChange] = useState(String)
  const [totalUsers, settotalUsers] = useState(Number)
  const [percentTotalUsers, setpercentTotalUsers] = useState(Number)
  const [percentTotalUsersChange, setpercentTotalUsersChange] = useState(String)
  const [totalNewUsers, settotalNewUsers] = useState(Number)
  const [percentNewUsers, setpercentNewUsers] = useState(Number)
  const [percentNewUsersChange, setpercentNewUsersChange] = useState(String)
  const [canViewReports, setCanViewReports] = useState(false)
  const hasAccessToViewReports = useHasAccess(appPermissions.ReportViewer)

  const [dashboardListMeta, setDashboardMeta] = useState({})

  const boxBgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")

  useEffect(() => {
    setCanViewReports(hasAccessToViewReports)
  }, [hasAccessToViewReports])

  useEffect(() => {
    if (!canViewReports) {
      return
    }
    initDashboardData()
  }, [canViewReports])

  async function initDashboardData() {
    let _dashboardListMeta = {}
    const ordersList = await ordersService.list()
    const productsList = await productsService.list()
    const promotionsList = await promotionsService.list()
    const usersList = await promotionsService.list()
    //Todays Sales
    const todaysSales = await dashboardService.getTodaysMoney()
    settotalTodaysSales(todaysSales)
    const previousTodaysSales = await dashboardService.getPreviousTodaysMoney()
    const percentChange = ((todaysSales - previousTodaysSales) / todaysSales) * 100.0
    setpreviousTodaysSales(Math.round(percentChange))

    let percentChangeToday = "pos"
    if (todaysSales < previousTodaysSales) {
      percentChangeToday = "neg"
    }
    setpercentTodaysSalesChange(percentChangeToday)

    //Total Sales
    const totalSales = await dashboardService.getTotalSales()
    settotalSales(totalSales)

    const previousTotalSales = await dashboardService.getPreviousTotalSales()
    const percentChangeTotalSales = ((totalSales - previousTotalSales) / totalSales) * 100.0
    setpercentSales(Math.round(percentChangeTotalSales))

    let percentChangeTotal = "pos"
    if (totalSales < previousTotalSales) {
      percentChangeTotal = "neg"
    }
    setpercentSalesChange(percentChangeTotal)

    //Total Users
    const totalUsers = await dashboardService.getTotalUsers()
    settotalUsers(totalUsers.toLocaleString("en-US"))

    const previousTotalUsers = await dashboardService.getPreviousTotalUsers()
    const percentChangeTotalUsers = ((totalUsers - previousTotalUsers) / totalUsers) * 100.0
    setpercentTotalUsers(Math.round(percentChangeTotalUsers))

    let percentChangeUsers = "pos"
    if (totalUsers < previousTotalUsers) {
      percentChangeUsers = "neg"
    }
    setpercentTotalUsersChange(percentChangeUsers)

    //Total New Users
    const totalNewUsers = await dashboardService.getTotalNewUsers()
    settotalNewUsers(totalNewUsers.toLocaleString("en-US"))

    const previousTotalNewUsers = await dashboardService.getPreviousTotalNewUsers()
    const percentChangeTotalNewUsers = ((totalNewUsers - previousTotalNewUsers) / totalNewUsers) * 100.0
    setpercentNewUsers(Math.round(percentChangeTotalNewUsers))

    let percentChangeNewUsers = "pos"
    if (totalNewUsers < previousTotalNewUsers) {
      percentChangeNewUsers = "neg"
    }
    setpercentNewUsersChange(percentChangeNewUsers)

    setDashboardMeta(_dashboardListMeta)
    //setBuyers(buyersList.Items)
    setOrders(ordersList.Items)
    setProducts(productsList.Items)
    setPromotions(promotionsList.Items)
    setUsers(usersList.Items)
  }

  const gradient = colorMode === "light" ? "linear(to-t, brand.300, brand.400)" : "linear(to-t, brand.600, brand.500)"
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")

  if (!canViewReports) {
    return <div></div>
  }

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
      width="100%"
    >
      <NextSeo title="Dashboard" />
      <VStack as="section" width="full" align="center">
        <HStack as="section" w="100%" p="3">
          <Container maxW="full" fontSize="x-small" fontWeight="normal">
            <SimpleGrid
              columns={{xl: 2, lg: 2, md: 1, sm: 1, base: 1}}
              gap={{xl: 6, lg: 4, md: 2, sm: 1, base: 1}}
              mt={{xl: 4, lg: 4, md: 2, sm: 0, base: 0}}
              mb={0}
            >
              <GridItem>
                <SimpleGrid
                  columns={{xl: 2, lg: 2, md: 1, sm: 1, base: 1}}
                  gap={{xl: 6, lg: 4, md: 2, sm: 0, base: 0}}
                  mt={{xl: 4, lg: 4, md: 2, sm: 0, base: 0}}
                  mb={0}
                >
                  <GridItem>
                    <Box w="full" width="100%">
                      <Link href="#">
                        <TodaysMoney
                          title="todays money"
                          totalamount={` ${priceHelper.formatShortPrice(totalTodaysSales)}`}
                          percentchange={previousTodaysSales}
                          percentchangetype={percentTodaysSalesChange}
                          percentlabel="Compared to last month (mtd)"
                          icon={<Icon as={HiOutlineFolderOpen} />}
                        />
                      </Link>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box w="full" width="100%">
                      <Link href="#">
                        <TotalSales
                          title="total sales"
                          totalamount={` ${priceHelper.formatShortPrice(totalSales)}`}
                          percentchange={percentSales}
                          percentchangetype={percentSalesChange}
                          percentlabel="Compared to last year  (ytd)"
                          icon={<Icon as={HiOutlineCurrencyDollar} />}
                        />
                      </Link>
                    </Box>
                  </GridItem>
                </SimpleGrid>
                <SimpleGrid
                  columns={{xl: 2, lg: 2, md: 1, sm: 1, base: 1}}
                  gap={{xl: 6, lg: 4, md: 2, sm: 0, base: 0}}
                  mt={{xl: 4, lg: 4, md: 2, sm: 0, base: 0}}
                  mb={0}
                >
                  <GridItem>
                    <Box w="full" width="100%">
                      <Link href="#">
                        <NewClients
                          title="new users"
                          totalamount={totalNewUsers}
                          percentchange={percentNewUsers}
                          percentchangetype={percentNewUsersChange}
                          percentlabel="Compared to last month (mtd)"
                          icon={<Icon as={HiOutlineUserAdd} />}
                        />
                      </Link>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box w="full" width="100%">
                      <Link href="#">
                        <TodaysUsers
                          title="total users"
                          totalamount={totalUsers}
                          percentchange={percentTotalUsers}
                          percentchangetype={percentTotalUsersChange}
                          percentlabel="Compared to last year  (ytd)"
                          icon={<Icon as={HiOutlineUserCircle} />}
                        />
                      </Link>
                    </Box>
                  </GridItem>
                </SimpleGrid>
              </GridItem>
              <GridItem mt={{xl: 4, lg: 4, md: 2, sm: 0, base: 0}} mb={{xl: 4, lg: 4, md: 2, sm: 4, base: 4}}>
                <Link href="#">
                  <AverageOrderAmount />
                </Link>
              </GridItem>
            </SimpleGrid>
            <SimpleGrid
              columns={{xl: 4, lg: 2, md: 2, sm: 1, base: 1}}
              gap={{xl: 6, lg: 4, md: 2, sm: 1, base: 1}}
              mt={0}
              mb={{xl: 4, lg: 4, md: 2, sm: 0, base: 0}}
            >
              <GridItem mb={{xl: 0, lg: 0, md: 2, sm: 2, base: 2}}>
                <Link href="/products">
                  <Card showclosebutton="false" p="0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor} color={color}>
                    <HStack justifyContent="space-around" w="100%" width="full">
                      <Heading size="md">
                        Products
                        <Text
                          as="span"
                          pl={{
                            xl: "8px",
                            lg: "8px",
                            md: "0px",
                            sm: "0px",
                            base: "0px"
                          }}
                        >
                          {products != null ? (
                            <i>({products.length})</i>
                          ) : (
                            <Box pt={2}>
                              <BrandedSpinner />
                            </Box>
                          )}
                        </Text>
                      </Heading>
                      <Image src="/images/icon_product.png" alt="Icon Products" />
                    </HStack>
                  </Card>
                </Link>
              </GridItem>
              <GridItem mb={{xl: 0, lg: 0, md: 2, sm: 2, base: 2}}>
                <Link href="/orders">
                  <Card showclosebutton="false" p="0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor} color={color}>
                    <HStack justifyContent="space-around" w="100%" width="full">
                      <Heading size="md">
                        Orders
                        <Text
                          as="span"
                          pl={{
                            xl: "8px",
                            lg: "8px",
                            md: "0px",
                            sm: "0px",
                            base: "0px"
                          }}
                        >
                          {orders != null ? (
                            <i>({orders.length})</i>
                          ) : (
                            <Box pt={2}>
                              <BrandedSpinner />
                            </Box>
                          )}
                        </Text>
                      </Heading>
                      <Image src="/images/icon_order.png" alt="Icon Orders" />
                    </HStack>
                  </Card>
                </Link>
              </GridItem>
              <GridItem mb={{xl: 0, lg: 0, md: 2, sm: 2, base: 2}}>
                <Link href="/users">
                  <Card showclosebutton="false" p="0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor} color={color}>
                    <HStack justifyContent="space-around" w="100%" width="full" direction={{base: "column", md: "row"}}>
                      <Heading size="md">
                        Users
                        <Text
                          as="span"
                          pl={{
                            xl: "8px",
                            lg: "8px",
                            md: "0px",
                            sm: "0px",
                            base: "0px"
                          }}
                        >
                          {users != null ? (
                            <i>({users.length})</i>
                          ) : (
                            <Box pt={2}>
                              <BrandedSpinner />
                            </Box>
                          )}
                        </Text>
                      </Heading>
                      <Image src="/images/icon_user.png" alt="Icon Users" />
                    </HStack>
                  </Card>
                </Link>
              </GridItem>
              <GridItem mb={{xl: 0, lg: 0, md: 2, sm: 2, base: 2}}>
                <Link href="/promotions">
                  <Card showclosebutton="false" p="0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor} color={color}>
                    <HStack justifyContent="space-around" w="100%" width="full">
                      <Heading size="md">
                        Promotions
                        <Text
                          as="span"
                          pl={{
                            xl: "8px",
                            lg: "8px",
                            md: "0px",
                            sm: "0px",
                            base: "0px"
                          }}
                        >
                          {promotions != null ? (
                            <i>({promotions.length})</i>
                          ) : (
                            <Box pt={2}>
                              <BrandedSpinner />
                            </Box>
                          )}
                        </Text>
                      </Heading>
                      <Image src="/images/icon_promo.png" alt="Icon Promotions" />
                    </HStack>
                  </Card>
                </Link>
              </GridItem>
            </SimpleGrid>
          </Container>
        </HStack>
      </VStack>
    </Flex>
  )
}

export default Dashboard

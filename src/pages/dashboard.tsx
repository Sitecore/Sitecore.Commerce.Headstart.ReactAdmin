import {
  Box,
  Container,
  Flex,
  Card,
  GridItem,
  HStack,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  Grid,
  CardHeader,
  CardBody
} from "@chakra-ui/react"
import { HiOutlineCurrencyDollar, HiOutlineFolderOpen, HiOutlineUserAdd, HiOutlineUserCircle } from "react-icons/hi"
import { useEffect, useState } from "react"
import AverageOrderAmount from "components/analytics/AverageOrderAmount"
import BrandedSpinner from "components/branding/BrandedSpinner"
// import Card from "components/card/Card"
import NewClients from "components/analytics/PercentChangeTile"
import { NextSeo } from "next-seo"
import TodaysMoney from "components/analytics/PercentChangeTile"
import TodaysUsers from "components/analytics/PercentChangeTile"
import TotalSales from "components/analytics/PercentChangeTile"
import { appPermissions } from "constants/app-permissions.config"
import { priceHelper } from "utils/price.utils"
import useHasAccess from "hooks/useHasAccess"
import { Link } from "components/navigation/Link"
import { Orders, Products, Promotions } from "ordercloud-javascript-sdk"
import { IOrder } from "types/ordercloud/IOrder"
import { IProduct } from "types/ordercloud/IProduct"
import { IPromotion } from "types/ordercloud/IPromotion"
import { dashboardService } from "services/dashboard.service"
import schraTheme from "theme/theme"

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode()
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
    const ordersList = await Orders.List<IOrder>("All")
    const productsList = await Products.List<IProduct>()
    const promotionsList = await Promotions.List<IPromotion>()
    const usersList = await Promotions.List<IPromotion>()
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

  // TODO: build skeleton for this
  if (!canViewReports) {
    return <div></div>
  }

  const productsLatestUpdated = new Date(products?.map((i) => i?.Inventory)?.map((lu) => lu?.LastUpdated)?.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})).toLocaleDateString()
  const ordersLatestUpdated = new Date(orders?.map((lu) => lu?.LastUpdated)?.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})).toLocaleDateString()
  const userLatestUpdated = new Date(users?.map((i) => i?.StartDate)?.filter((wtf) => wtf)?.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})).toLocaleDateString()




  const data = [
    { label: "product", funFact: productsLatestUpdated },
    { label: "order", funFact: ordersLatestUpdated },
    { label: "user", funFact: userLatestUpdated },
    { label: "promotion" }
  ]



  const miniWidgets = data.map((item) => (
    <Card as={Link} variant={"levitating"} border={`.5px solid ${schraTheme.colors.blackAlpha[300]}`} textDecoration="none" href={"/" + item.label} key={item.label}>
      <CardHeader>
        <Heading size="md">
          {item.label}s
        </Heading>
      </CardHeader>
      <CardBody>
        {products != null ? (
          <Text fontSize="3xl">{products.length}</Text>
        ) : (
          <Box pt={2}>
            <BrandedSpinner />
          </Box>
        )}
        <Text fontSize="xs" fontWeight="normal" color="blackAlpha.400">
          latest {item.label} update: {item.funFact}
        </Text>
      </CardBody>
    </Card>
  ))

  return (
    <VStack flexGrow={1} gap={4} p={8}
      h="100%" w="100%" bg={"blackAlpha.50"}>
      <SimpleGrid w="full" spacing={4} templateColumns='repeat(auto-fit, minmax(200px, 1fr))'>
        {miniWidgets}
      </SimpleGrid>
      <NextSeo title="Dashboard" />
      <Grid maxW="full" fontSize="x-small" fontWeight="normal" w="100%">
        <Box>
          <TodaysMoney
            title="todays money"
            totalamount={` ${priceHelper.formatShortPrice(totalTodaysSales)} `}
            percentchange={previousTodaysSales}
            percentchangetype={percentTodaysSalesChange}
            percentlabel="Compared to last month (mtd)"
            icon={<Icon as={HiOutlineFolderOpen} />}
          />
        </Box>

        <Box>
          <TotalSales
            title="total sales"
            totalamount={` ${priceHelper.formatShortPrice(totalSales)} `}
            percentchange={percentSales}
            percentchangetype={percentSalesChange}
            percentlabel="Compared to last year  (ytd)"
            icon={<Icon as={HiOutlineCurrencyDollar} />}
          />
        </Box>

        <Box>
          <NewClients
            title="new users"
            totalamount={totalNewUsers}
            percentchange={percentNewUsers}
            percentchangetype={percentNewUsersChange}
            percentlabel="Compared to last month (mtd)"
            icon={<Icon as={HiOutlineUserAdd} />}
          />
        </Box>

        <Box>
          <TodaysUsers
            title="total users"
            totalamount={totalUsers}
            percentchange={percentTotalUsers}
            percentchangetype={percentTotalUsersChange}
            percentlabel="Compared to last year  (ytd)"
            icon={<Icon as={HiOutlineUserCircle} />}
          />
        </Box>


        <AverageOrderAmount />
        <Link href="/products">
          <Card p="0px" mb={{ sm: "26px", lg: "0px" }} color={color}>
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


        <Link href="/orders">
          <Card p="0px" mb={{ sm: "26px", lg: "0px" }} color={color}>
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


        <Link href="/users">
          <Card p="0px" mb={{ sm: "26px", lg: "0px" }} color={color}>
            <HStack justifyContent="space-around" w="100%" width="full" direction={{ base: "column", md: "row" }}>
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
        <Link href="/promotions">
          <Card p="0px" mb={{ sm: "26px", lg: "0px" }} color={color}>
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
      </Grid>
    </VStack>
  )
}

export default Dashboard

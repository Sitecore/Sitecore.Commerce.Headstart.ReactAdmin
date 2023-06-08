import {
  Card,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  CardHeader,
  CardBody,
  Spinner,
  IconButton,
  Flex,
  useMediaQuery,
  theme,
  Heading
} from "@chakra-ui/react"
import { HiOutlineCurrencyDollar, HiOutlineFolderOpen, HiOutlineUserAdd, HiOutlineUserCircle } from "react-icons/hi"
import { useEffect, useState } from "react"
import AverageOrderAmount from "components/analytics/AverageOrderAmount"
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
import { TbArrowsDiagonal } from "react-icons/tb"

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

  const [above2xl] = useMediaQuery(`(min-width: ${theme.breakpoints["2xl"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

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

  const gradient =
    colorMode === "light" ? "linear(to-t, accent.300, accent.400)" : "linear(to-t, accent.600, accent.500)"
  const color = useColorModeValue("blackAlpha.500", "whiteAlpha.500")
  const labelColor = useColorModeValue("blackAlpha.400", "whiteAlpha.500")

  // TODO: build skeleton for this
  if (!canViewReports) {
    return <div></div>
  }

  const productsLatestUpdated = new Date(
    (products || [])
      .filter((p) => p.Inventory !== null)
      .map((i) => i?.Inventory)
      .map((lu) => lu?.LastUpdated)
      .reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})
  ).toLocaleDateString()
  const ordersLatestUpdated = new Date(
    orders?.map((lu) => lu?.LastUpdated)?.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})
  ).toLocaleDateString()
  const usersLatestUpdated = new Date(
    users
      ?.map((i) => i?.StartDate)
      ?.filter((wtf) => wtf)
      ?.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})
  ).toLocaleDateString()
  const promotionsLatestUpdated = new Date(
    promotions
      ?.map((i) => i?.StartDate)
      ?.filter((wtf) => wtf)
      ?.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b), {})
  ).toLocaleDateString()

  console.log("promotions", promotionsLatestUpdated)

  const data = [
    { label: "products", labelSingular: "product", var: products, funFact: productsLatestUpdated },
    { label: "orders", labelSingular: "order", var: orders, funFact: ordersLatestUpdated },
    { label: "users", labelSingular: "user", var: users, funFact: usersLatestUpdated },
    { label: "promotions", labelSingular: "promotion", var: promotions, funFact: promotionsLatestUpdated }
  ]

  const miniWidgets = data.map((item) => (
    <Card
      as={Link}
      variant={"levitating"}
      border={`.5px solid ${schraTheme.colors.blackAlpha[300]}`}
      href={"/" + item.label}
      key={item.label}
      pos={"relative"}
    >
      <IconButton
        icon={<TbArrowsDiagonal />}
        variant={"outline"}
        size="xs"
        aria-label={""}
        pos="absolute"
        right={2}
        top={2}
      />
      <CardHeader py={0}>
        {item.var != null ? (
          <Text fontWeight={"light"} color={color} fontSize="5xl">
            {item.var.length}
          </Text>
        ) : (
          <Spinner mt={4} />
        )}
      </CardHeader>
      <CardBody pt={0}>
        <Heading fontSize="lg" mb="6px" textTransform="capitalize" mt={"auto"}>
          {item.label}
        </Heading>
        <Text fontSize="xs" fontWeight="normal" color={labelColor} casing="uppercase">
          latest {item.label.toString()} update:
          <Text as={"span"} fontSize="xs" fontWeight={"semibold"}>
            {" "}
            {item.funFact}
          </Text>
        </Text>
      </CardBody>
    </Card>
  ))

  return (
    <>
      <NextSeo title="Dashboard" />
      <VStack flexGrow={1} gap={4} p={[4, 6, 8]} h="100%" w="100%" bg={"st.mainBackgroundColor"}>
        <Flex w="100%" gap={4} direction={above2xl ? "row" : "column-reverse"}>
          <SimpleGrid
            w="100%"
            gap={4}
            templateRows={above2xl && "1fr 1fr"}
            templateColumns={{
              md: "1fr 1fr",
              xl: "repeat(auto-fit, minmax(48%, 1fr))"
            }}
          >
            <TodaysMoney
              title="todays money"
              totalamount={` ${priceHelper.formatShortPrice(totalTodaysSales)} `}
              percentchange={previousTodaysSales}
              percentchangetype={percentTodaysSalesChange}
              percentlabel="Compared to last month (mtd)"
              icon={<Icon as={HiOutlineFolderOpen} />}
            />

            <TotalSales
              title="total sales"
              totalamount={` ${priceHelper.formatShortPrice(totalSales)} `}
              percentchange={percentSales}
              percentchangetype={percentSalesChange}
              percentlabel="Compared to last year  (ytd)"
              icon={<Icon as={HiOutlineCurrencyDollar} />}
            />

            <NewClients
              title="new users"
              totalamount={totalNewUsers}
              percentchange={percentNewUsers}
              percentchangetype={percentNewUsersChange}
              percentlabel="Compared to last month (mtd)"
              icon={<Icon as={HiOutlineUserAdd} />}
            />

            <TodaysUsers
              title="total users"
              totalamount={totalUsers}
              percentchange={percentTotalUsers}
              percentchangetype={percentTotalUsersChange}
              percentlabel="Compared to last year  (ytd)"
              icon={<Icon as={HiOutlineUserCircle} />}
            />
          </SimpleGrid>
          <AverageOrderAmount />
        </Flex>

        <SimpleGrid w="full" spacing={4} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
          {miniWidgets}
        </SimpleGrid>
      </VStack>
    </>
  )
}

export default Dashboard

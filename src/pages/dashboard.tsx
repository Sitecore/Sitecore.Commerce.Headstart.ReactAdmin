import {
  Card,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  CardHeader,
  CardBody,
  Spinner,
  IconButton,
  Flex,
  useMediaQuery,
  theme,
  Heading,
  Skeleton
} from "@chakra-ui/react"
import {HiOutlineCurrencyDollar, HiOutlineFolderOpen, HiOutlineUserAdd} from "react-icons/hi"
import {useEffect, useState} from "react"
import AverageOrderAmount from "components/analytics/AverageOrderAmount"
import {NextSeo} from "next-seo"
import PercentChangeTile from "components/analytics/PercentChangeTile"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {Link} from "@chakra-ui/next-js"
import {ListPage} from "ordercloud-javascript-sdk"
import {IOrder} from "types/ordercloud/IOrder"
import {dashboardService} from "services/dashboard.service"
import schraTheme from "theme/theme"
import {TbArrowsDiagonal} from "react-icons/tb"
import {appSettings} from "config/app-settings"
import {dateHelper} from "utils"

interface DashboardData {
  todaysSales?: number
  previousTodaysSales?: number
  weekSales?: number
  previousWeekSales?: number
  weekUniqueUsers?: number
  previousWeekUniqueUsers?: number
  ordersList?: ListPage<IOrder>
  totalProductsCount?: number
  totalPromosCount?: number
}

const Dashboard = () => {
  const color = useColorModeValue("blackAlpha.500", "whiteAlpha.500")
  const labelColor = useColorModeValue("blackAlpha.400", "whiteAlpha.500")
  const hasAccessToViewReports = useHasAccess(appPermissions.DashboardViewer)
  const [canViewReports, setCanViewReports] = useState(false)
  const [data, setData] = useState<DashboardData>({})

  const [above2xl] = useMediaQuery(`(min-width: ${theme.breakpoints["2xl"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  useEffect(() => {
    setCanViewReports(hasAccessToViewReports)
  }, [hasAccessToViewReports])

  useEffect(() => {
    const initDashboardData = async () => {
      const [ordersList, totalProductsCount, totalPromosCount] = await Promise.all([
        dashboardService.listAllOrdersSincePreviousWeek(),
        dashboardService.getTotalProductsCount(),
        dashboardService.getTotalPromosCount()
      ])

      // Todays Sales
      const todaysSales = dashboardService.getTodaysMoney(ordersList.Items)
      const previousTodaysSales = dashboardService.getPreviousTodaysMoney(ordersList.Items)

      // Total Sales
      const weekSales = dashboardService.getWeeklySales(ordersList.Items)
      const previousWeekSales = dashboardService.getPreviousWeeklySales(ordersList.Items)

      // Unique Users
      const weekUniqueUsers = dashboardService.getWeekUniqueUsers(ordersList.Items)
      const previousWeekUniqueUsers = dashboardService.getPreviousWeekUniqueUsers(ordersList.Items)

      setData({
        todaysSales,
        previousTodaysSales,
        weekSales,
        previousWeekSales,
        weekUniqueUsers,
        previousWeekUniqueUsers,
        ordersList,
        totalProductsCount,
        totalPromosCount
      })
    }
    if (!canViewReports) {
      return
    }
    initDashboardData()
  }, [canViewReports])

  if (!canViewReports) {
    return <div></div>
  }

  const miniWidgetsData = [
    {
      label: "total orders",
      labelSingular: "order",
      count: data.ordersList?.Meta?.TotalCount,
      lastUpdated: dateHelper.formatDate(
        data.ordersList?.Items?.length ? data.ordersList.Items[0].LastUpdated : new Date().toISOString()
      )
    },
    {label: "total products", labelSingular: "product", count: data.totalProductsCount},
    {
      label: "total promotions",
      labelSingular: "promotion",
      count: data.totalPromosCount
    }
  ]

  const percentChangeTileData = [
    {
      title: "Today's Money",
      label: "Compared to yesterday",
      currentAmount: data.todaysSales,
      previousAmount: data.previousTodaysSales,
      icon: <Icon as={HiOutlineFolderOpen} />
    },
    {
      title: "Unique weekly users",
      label: "Compared to last week (wtd)",
      currentAmount: data.weekUniqueUsers,
      previousAmount: data.previousWeekUniqueUsers,
      icon: <Icon as={HiOutlineUserAdd} />,
      isMoney: false
    },
    {
      title: "Week Sales",
      label: "Compared to last week (wtd)",
      currentAmount: data.weekSales,
      previousAmount: data.previousWeekSales,
      icon: <Icon as={HiOutlineCurrencyDollar} />
    },
    {
      title: "Previous Week Sales",
      label: "",
      currentAmount: data.previousWeekSales,
      previousAmount: 0,
      icon: ""
    }
  ]

  const miniWidgets = miniWidgetsData.map((item) => (
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
        {typeof item.count === "number" ? (
          <Text fontWeight={"light"} color={color} fontSize="5xl">
            {item.count}
          </Text>
        ) : (
          <Spinner mt={4} />
        )}
      </CardHeader>
      <CardBody pt={0}>
        <Heading fontSize="lg" mb="6px" textTransform="capitalize" mt={"auto"}>
          {item.label}
        </Heading>
        {item.lastUpdated && (
          <Text fontSize="xs" fontWeight="normal" color={labelColor} casing="uppercase">
            latest {item.label.toString()} update:
            <Text as={"span"} fontSize="xs" fontWeight={"semibold"}>
              {" "}
              {item.lastUpdated}
            </Text>
          </Text>
        )}
      </CardBody>
    </Card>
  ))

  if (typeof data.todaysSales === "undefined") {
    return (
      <>
        <NextSeo title="Dashboard" />
        <VStack flexGrow={1} gap={4} p={[4, 6, 8]} h="100%" w="100%" bg={"st.mainBackgroundColor"}>
          <Flex w="100%" gap={4} direction={above2xl ? "row" : "column-reverse"}>
            <SimpleGrid
              w="100%"
              gap={4}
              templateColumns={{
                md: "1fr 1fr"
              }}
            >
              {percentChangeTileData.map((_item, index) => {
                return <Skeleton key={index} borderRadius="md" w="100%" h="171px" />
              })}
            </SimpleGrid>
            {!appSettings.useRealDashboardData && <AverageOrderAmount />}
          </Flex>

          <SimpleGrid w="full" spacing={4} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
            {miniWidgetsData.map((_item, index) => {
              return <Skeleton key={index} borderRadius="md" w="100%" h="138px" />
            })}
          </SimpleGrid>
        </VStack>
      </>
    )
  }

  return (
    <>
      <NextSeo title="Dashboard" />
      <VStack flexGrow={1} gap={4} p={[4, 6, 8]} h="100%" w="100%" bg={"st.mainBackgroundColor"}>
        <Flex w="100%" gap={4} direction={above2xl ? "row" : "column-reverse"}>
          <SimpleGrid
            w="100%"
            gap={4}
            templateColumns={{
              md: "1fr 1fr"
            }}
          >
            {percentChangeTileData.map((item) => {
              return (
                <PercentChangeTile
                  key={item.title}
                  title={item.title}
                  label={item.label}
                  currentAmount={item.currentAmount}
                  previousAmount={item.previousAmount}
                  icon={item.icon}
                  isMoney={item.isMoney}
                />
              )
            })}
          </SimpleGrid>
          {!appSettings.useRealDashboardData && <AverageOrderAmount />}
        </Flex>

        <SimpleGrid w="full" spacing={4} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
          {miniWidgets}
        </SimpleGrid>
      </VStack>
    </>
  )
}

export default Dashboard

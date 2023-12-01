import {appSettings} from "config/app-settings"
import {Orders, Products, Promotions} from "ordercloud-javascript-sdk"
import {IOrder} from "types/ordercloud/IOrder"
import {endOfToday, endOfWeek, endOfYesterday, startOfToday, startOfWeek, startOfYesterday, subWeeks} from "date-fns"
import {uniq} from "lodash"
import pLimit from "p-limit"
const mockData = require("../mockdata/dashboard_data.json")

export const dashboardService = {
  getTodaysMoney,
  getPreviousTodaysMoney,
  getWeeklySales,
  getPreviousWeeklySales,
  getWeekUniqueUsers,
  getPreviousWeekUniqueUsers,
  listAllOrdersSincePreviousWeek,
  getTotalPromosCount,
  getTotalProductsCount
}

function getTodaysMoney(orders: IOrder[]): number {
  if (!appSettings.useRealDashboardData) {
    return mockData.todaysmoney.totalamount
  }
  const startOfTodayIso = startOfToday().toISOString()
  const endOfTodayIso = endOfToday().toISOString()

  return getTotalSalesForRange(orders, startOfTodayIso, endOfTodayIso)
}

function getPreviousTodaysMoney(orders: IOrder[]): number {
  if (!appSettings.useRealDashboardData) {
    return mockData.todaysmoney.previoustotalamount
  }
  const startOfYesterdayIso = startOfYesterday().toISOString()
  const endOfYesterdayIso = endOfYesterday().toISOString()

  return getTotalSalesForRange(orders, startOfYesterdayIso, endOfYesterdayIso)
}

function getWeeklySales(orders: IOrder[]): number {
  if (!appSettings.useRealDashboardData) {
    return mockData.weeksales.totalamount
  }
  const now = new Date()
  const startOfWeekIso = startOfWeek(now).toISOString()
  const endOfWeekIso = endOfWeek(now).toISOString()

  return getTotalSalesForRange(orders, startOfWeekIso, endOfWeekIso)
}

function getPreviousWeeklySales(orders: IOrder[]): number {
  if (!appSettings.useRealDashboardData) {
    return mockData.weeksales.previoustotalamount
  }
  const now = new Date()
  const previousWeek = subWeeks(now, 1)
  const startOfPreviousWeekIso = startOfWeek(previousWeek).toISOString()
  const endOfPreviousWeekIso = endOfWeek(previousWeek).toISOString()

  return getTotalSalesForRange(orders, startOfPreviousWeekIso, endOfPreviousWeekIso)
}

function getWeekUniqueUsers(orders: IOrder[]): number {
  if (!appSettings.useRealDashboardData) {
    return mockData.uniqueusers.totalamount
  }
  const now = new Date()
  const startOfWeekIso = startOfWeek(now).toISOString()
  const endOfWeekIso = endOfWeek(now).toISOString()

  const userList = uniq(
    orders
      .filter((order) => {
        return order.DateSubmitted > startOfWeekIso && order.DateSubmitted < endOfWeekIso
      })
      .map((order) => order.FromUserID)
  )

  return userList.length
}

function getPreviousWeekUniqueUsers(orders: IOrder[]): number {
  if (!appSettings.useRealDashboardData) {
    return mockData.uniqueusers.previoustotalamount
  }
  const now = new Date()
  const previousWeek = subWeeks(now, 1)
  const startOfPreviousWeekIso = startOfWeek(previousWeek).toISOString()
  const endOfPreviousWeekIso = endOfWeek(previousWeek).toISOString()

  const userList = uniq(
    orders
      .filter((order) => {
        return order.DateSubmitted > startOfPreviousWeekIso && order.DateSubmitted < endOfPreviousWeekIso
      })
      .map((order) => order.FromUserID)
  )

  return userList.length
}

function getTotalSalesForRange(orders: IOrder[], start: string, end: string): number {
  const filteredOrders = orders.filter((order) => {
    return order.DateSubmitted > start && order.DateSubmitted < end
  })
  const result = filteredOrders.reduce((accumulator, obj) => {
    return accumulator + obj.Total
  }, 0)
  return result
}

async function getTotalPromosCount(): Promise<number> {
  if (!appSettings.useRealDashboardData) {
    return mockData.totalpromos.totalamount
  }
  const response = await Promotions.List()
  return response.Meta.TotalCount
}

async function getTotalProductsCount(): Promise<number> {
  if (!appSettings.useRealDashboardData) {
    return mockData.totalproducts.totalamount
  }
  const response = await Products.List()
  return response.Meta.TotalCount
}

async function listAllOrdersSincePreviousWeek() {
  if (!appSettings.useRealDashboardData) {
    return {
      Meta: {
        TotalCount: 120
      }
    }
  }
  const now = new Date()
  const previousWeek = subWeeks(now, 1)
  const startOfPreviousWeek = startOfWeek(previousWeek).toISOString()
  const filters = {
    sortBy: ["DateSubmitted" as "DateSubmitted"],
    filters: {
      DateSubmitted: `>${startOfPreviousWeek}`
    },
    pageSize: 100
  }
  const response1 = await Orders.List<IOrder>("All", filters)
  if (response1.Meta.TotalPages <= 1) {
    return response1
  }

  // max allowed by Chrome for same domain
  // consider aggregating totals on server at some interval (daily or hourly) if this is too slow
  const maxConcurrent = 6
  const limitToMaxConcurrent = pLimit(maxConcurrent)
  const requests = new Array(response1.Meta.TotalPages - 1).fill("").map(async (_, i) =>
    limitToMaxConcurrent(() => {
      console.timeStamp(`Requesting page ${i + 2} of ${response1.Meta.TotalPages}`)
      return Orders.List("All", {...filters, page: i + 2})
    })
  )
  const responses = await Promise.all(requests)
  const allOrders = responses.reduce((accumulator, response) => {
    return accumulator.concat(response.Items)
  }, response1.Items)

  return {
    Meta: {
      Page: 1,
      PageSize: allOrders.length,
      TotalCount: allOrders.length,
      TotalPages: 1,
      ItemRange: [0, allOrders.length - 1]
    },
    Items: allOrders
  }
}

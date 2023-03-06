import {Orders, Users} from "ordercloud-javascript-sdk"

const d = new Date()
let day = d.getDate()
let month = d.getMonth() + 1 //Need the plus 1 since it is an array of 0-11
let year = d.getFullYear()
let previousMonth = d.getMonth()
if (d.getMonth() === 0) {
  previousMonth = 11
}
let previousMonthYear = d.getFullYear()
if (d.getMonth() === 0) {
  previousMonthYear = d.getFullYear() - 1
}
let mockData
if (!process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
  mockData = require("../mockdata/dashboard_data.json")
}

export const dashboardService = {
  getTodaysMoney,
  getPreviousTodaysMoney,
  getTotalSales,
  getPreviousTotalSales,
  getTotalUsers,
  getPreviousTotalUsers,
  getTotalNewUsers,
  getPreviousTotalNewUsers
  //,
  //getTotalSalesByMonth,
  //getTotalSalesPreviousYearByMonth
}

async function getTodaysMoney() {
  // Total Sales todate this month
  //console.log("dashboardService::getTodaysSales")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const ordersList = await Orders.List("All", {
      filters: {
        DateCreated: [">" + year + "-" + month + "-01", "<" + year + "-" + month + "-" + day]
      }
    })
    result = ordersList.Items.reduce((accumulator, obj) => {
      return accumulator + obj.Total
    }, 0)
  } else {
    result = mockData.todaysmoney.totalamount
  }
  return await result
}

async function getPreviousTodaysMoney() {
  // Total Sales todate last month
  // console.log("dashboardService::getPreviousTodaysSales")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const ordersList = await Orders.List("All", {
      filters: {
        DateCreated: [
          ">" + previousMonthYear + "-" + previousMonth + "-01",
          "<" + previousMonthYear + "-" + previousMonth + "-" + day
        ]
      }
    })
    result = ordersList.Items.reduce((accumulator, obj) => {
      return accumulator + obj.Total
    }, 0)
  } else {
    result = mockData.todaysmoney.previoustotalamount
  }

  return await result
}

async function getTotalSales() {
  // Total Sales todate this month
  // console.log("dashboardService::getTotalSales")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const ordersList = await Orders.List("All", {
      filters: {
        DateCreated: [">" + year + "-01-01", "<" + year + "-" + month + "-" + day]
      }
    })
    result = ordersList.Items.reduce((accumulator, obj) => {
      return accumulator + obj.Total
    }, 0)
  } else {
    result = mockData.totalsales.totalamount
  }

  return await result
}

async function getPreviousTotalSales() {
  // Total Sales todate last month
  // console.log("dashboardService::getPreviousTotalSales")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const ordersList = await Orders.List("All", {
      filters: {
        DateCreated: [">" + (year - 1) + "-01-01", "<" + (year - 1) + "-" + month + "-" + day]
      }
    })
    result = ordersList.Items.reduce((accumulator, obj) => {
      return accumulator + obj.Total
    }, 0)
  } else {
    result = mockData.totalsales.previoustotalamount
  }

  return await result
}

// async function getTotalSalesByMonth() {
//   // Total Sales todate this month
//   // console.log("dashboardService::getTotalSales")
//   const ordersList = await Orders.List("All", {
//     filters: {
//       DateCreated: [">" + year + "-01-01", "<" + year + "-" + month + "-" + day]
//     }
//   })
//   const result = ordersList.Items.reduce((accumulator, obj) => {
//     return accumulator + accumulator + obj.Total
//   }, 0)
//   return await result
// }

// async function getTotalSalesPreviousYearByMonth() {
//   // Total Sales todate last month
//   // console.log("dashboardService::getPreviousTotalSales")
//   const ordersList = await Orders.List("All", {
//     filters: {
//       DateCreated: [
//         ">" + (year - 1) + "-01-01",
//         "<" + (year - 1) + "-" + month + "-" + day
//       ]
//     }
//   })
//   const result = ordersList.Items.reduce((accumulator, obj) => {
//     return accumulator + obj.Total
//   }, 0)
//   return await result
// }

async function getTotalUsers() {
  // Total Users todate this month
  //console.log("dashboardService::getTotalUsers")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const usersList = await Orders.List("All", {
      filters: {
        DateCreated: [">" + year + "-01-01", "<" + year + "-" + month + "-" + day]
      }
    })
    result = usersList.Items.length
  } else {
    result = mockData.totalusers.totalamount
  }

  return await result
}
async function getPreviousTotalUsers() {
  // Total Users todate this month
  //console.log("dashboardService::getTotalUsers")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const usersList = await Orders.List("All", {
      filters: {
        DateCreated: [">" + (year - 1) + "-01-01", "<" + (year - 1) + "-" + month + "-" + day]
      }
    })
    result = usersList.Items.length
  } else {
    result = mockData.totalusers.previoustotalamount
  }

  return await result
}

async function getTotalNewUsers() {
  // Total Users todate this month
  //console.log("dashboardService::getTotalUsers")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const usersList = await Orders.List("All", {
      filters: {
        DateCreated: [">" + year + "-01-01", "<" + year + "-" + month + "-" + day]
      }
    })
    result = usersList.Items.length
  } else {
    result = mockData.newusers.totalamount
  }

  return await result
}
async function getPreviousTotalNewUsers() {
  // Total Users todate this month
  //console.log("dashboardService::getTotalUsers")
  let result

  if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
    const usersList = await Orders.List("All", {
      filters: {
        DateCreated: [
          ">" + previousMonthYear + "-" + previousMonth + "-01",
          "<" + previousMonthYear + "-" + previousMonth + "-" + day
        ]
      }
    })
    result = usersList.Items.length
  } else {
    result = mockData.newusers.previoustotalamount
  }

  return await result
}

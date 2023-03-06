import {Flex, Text, Box, useColorModeValue} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import LineChart from "../charts/LineChart"
import Card from "../card/Card"
import {dashboardService} from "lib/api"

export default function AverageOrderAmount() {
  const boxBgColor = useColorModeValue("boxBgColor.100", "boxBgColor.600")
  const color = useColorModeValue("boxTextColor.900", "boxTextColor.100")
  const headingColor = useColorModeValue("boxTextColor.400", "boxTextColor.300")
  const [totalSales, settotalSales] = useState([Number])
  const [totalPreviousYearSales, settotalPreviousYearSales] = useState([Number])
  //const [chartData, setchartData] = useState()
  let chartData = require("../../mockdata/dashboard_data.json")
  console.log(chartData)
  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    if (process.env.NEXT_PUBLIC_OC_USELIVEDATA) {
      //TODO COMPLETE THIS SECTION
      //These functions will bring in real data
      //const totalSales = await dashboardService.getTotalSalesByMonth()
      //settotalSales(totalSales)
      //const totalSalesPreviousYear =
      // await dashboardService.getTotalSalesPreviousYearByMonth()
      //settotalPreviousYearSales(totalSalesPreviousYear)
    } else {
      //This function will bring in mock data
      //let data = require("../../mockdata/dashboard_data.json")
      //setchartData(data)
    }
  }
  const d = new Date()
  let year = d.getFullYear()
  const options = {
    chart: {
      height: "auto",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        autoSelected: "zoom"
      },
      zoom: {
        enabled: true,
        type: "x",
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.4
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.4,
            width: 1
          }
        }
      }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    title: {
      text: chartData.salesoverview.title,
      align: "left"
    }
  }
  const series = [
    {
      name: chartData.salesoverview.series.currentyear.title,
      data: chartData.salesoverview.series.currentyear.data
    },
    {
      name: chartData.salesoverview.series.previousyear.title,
      data: chartData.salesoverview.series.previousyear.data
    }
  ]

  return (
    <Card p="28px 10px 15px 0px" mb={{sm: "26px", lg: "0px"}} bg={boxBgColor}>
      <Flex direction="column" mb="GlobalPadding" ps="22px" alignSelf="flex-start">
        <Text fontSize="lg" textTransform="uppercase" mb="6px" color={headingColor}>
          {chartData.salesoverview.title}
        </Text>
        <Text fontSize="sm" fontWeight="medium" color={color}>
          <Text as="span" color="green.400" fontWeight="bold" pr="10px">
            ({chartData.salesoverview.percentchangeindicator}
            {chartData.salesoverview.percentchange}%) more
          </Text>
          in {year}
        </Text>
      </Flex>
      <Box w="100%" h={{sm: "100%", xl: "265px"}} ps="8px">
        <LineChart chartData={series} chartOptions={options} />
      </Box>
    </Card>
  )
}

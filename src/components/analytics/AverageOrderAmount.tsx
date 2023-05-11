import {
  Flex,
  Card,
  Text,
  Box,
  useColorModeValue,
  CardBody,
  CardHeader,
  Heading,
  theme,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useDisclosure,
  Collapse,
  Button,
  IconButton
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react"
import LineChart from "../charts/LineChart"
import {dashboardService} from "services/dashboard.service"
import schraTheme from "theme/theme"
import {
  TbArrowBackUp,
  TbCaretUp,
  TbChevronUp,
  TbCircleCaretUp,
  TbSquareChevronUp,
  TbSquareRoundedChevronUpFilled,
  TbTriangle,
  TbTriangleFilled
} from "react-icons/tb"
import {ChevronDownIcon, ChevronUpIcon, TriangleUpIcon} from "@chakra-ui/icons"

export default function AverageOrderAmount() {
  const headingColor = useColorModeValue("boxTextColor.400", "boxTextColor.300")
  const labelColor = useColorModeValue("blackAlpha.400", "whiteAlpha.500")
  const [totalSales, settotalSales] = useState([Number])
  const [totalPreviousYearSales, settotalPreviousYearSales] = useState([Number])
  const graphColor1 = useColorModeValue(schraTheme.colors.primary[500], schraTheme.colors.primary[300])
  const graphColor2 = useColorModeValue(schraTheme.colors.accent[500], schraTheme.colors.accent[300])
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
    colors: ["var(--schra-colors-primary-400)", "var(--schra-colors-accent-400)"],
    stroke: {
      lineCap: "round"
    },
    chart: {
      foreColor: useColorModeValue(schraTheme.colors.blackAlpha[500], schraTheme.colors.whiteAlpha[700]),
      height: "auto",
      toolbar: {
        show: false,
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
            color: schraTheme.colors.primary[500],
            opacity: 0.4
          },
          stroke: {
            curve: "smooth",
            lineCap: "round",
            color: schraTheme.colors.primary[500],
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
    <Card border=".5px solid" borderColor="st.borderColor" flex={"1 1 100%"}>
      <CardHeader display="flex" flexDirection="column" mb="GlobalPadding" ps="22px" alignSelf="flex-start">
        <Heading fontSize="lg" mb="6px" textTransform="capitalize" color={headingColor}>
          {chartData.salesoverview.title}
        </Heading>
        <Text
          as="span"
          fontSize="xs"
          fontWeight="normal"
          color={labelColor}
          casing="uppercase"
          display="inline-flex"
          alignItems={"center"}
          gap={1}
        >
          <Text as="span" color="green.400" fontWeight="bold" display="inline-flex" alignItems={"center"} gap={0.5}>
            <TriangleUpIcon />
            {chartData.salesoverview.percentchange}%
          </Text>
          {year}
        </Text>
      </CardHeader>
      <CardBody w="100%" minH={275} ps="8px">
        <LineChart chartData={series} chartOptions={options} />
      </CardBody>
    </Card>
  )
}

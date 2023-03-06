import React from "react"
import dynamic from "next/dynamic"
const ReactApexChart = dynamic(() => import("react-apexcharts"), {ssr: false})

export default function PieChart(props) {
  return <ReactApexChart options={props.chartOptions} series={props.chartData} type="pie" width="100%" height="100%" />
}

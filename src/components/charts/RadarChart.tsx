import React from "react"
import dynamic from "next/dynamic"
const ReactApexChart = dynamic(() => import("react-apexcharts"), {ssr: false})

export default function RadarChart(props) {
  return (
    <ReactApexChart options={props.chartOptions} series={props.chartData} type="radar" width="100%" height="100%" />
  )
}

import React, {Component} from "react"
import dynamic from "next/dynamic"
const ReactApexChart = dynamic(() => import("react-apexcharts"), {ssr: false})

export default function BubbleChart(props) {
  return (
    <ReactApexChart options={props.chartOptions} series={props.chartData} type="bubble" width="100%" height="100%" />
  )
}

/**
 * Renders a chart displaying temperature & humidity over time.
 */

import { useState, useEffect, useMemo } from "react"
import { fetchData } from "./api"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Tick,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

interface ClimateData {
  time: string
  temperature: number
  humidity: number
}

interface ChartData {
  labels: string[]
  datasets: Array<{ label: string, data: number[], borderColor: string }>
}

const emptyChartData = {
  labels: [],
  datasets: [
    { label: "Temperature", data: [], borderColor: "teal" },
    { label: "Humidity", data: [], borderColor: "purple" }
  ]
}

function DataChart({ newData }: { newData: ClimateData }) {
  const [maxPoints, setMaxPoints] = useState<number>(20)
  const [data, setData] = useState<ClimateData[]>([])

  useEffect(() => {
    async function fetchAPIData() {
      try {
        const response = await fetchData()
        setData(response.filter((entry) => isValid(entry)))
      } catch (error) {
        console.error("Error fetching sensor data: ", error)
      }
    }
    fetchAPIData()
  }, [])

  const chartData: ChartData = useMemo(() => {
    try {
      // Limit number of datapoints to prevent crowding
      const datapoints = data.slice(-maxPoints)

      return { 
        labels: datapoints.map((e) => e.time),
        datasets: [
          {
            label: "Temperature",
            data: datapoints.map((e) => e.temperature),
            borderColor: "teal"
          },
          {
            label: "Humidity",
            data: datapoints.map((e) => e.humidity),
            borderColor: "purple"
          }
        ]
      }
    } catch (error) {
      console.error("Unable to calculate chart data: ", error)
    }

    return emptyChartData
  }, [data, maxPoints])

  useEffect(() => {
    if (!isValid(newData)) {
      console.error("Malformed data: ", newData)
      return
    }

    setData(prevData => [...prevData, newData])
  }, [newData])

  const isValid = (entry: any) => {
    return (
      entry &&
      typeof entry.time === "string" &&
      typeof entry.temperature === "number" &&
      typeof entry.humidity === "number" &&
      !isNaN(Date.parse(entry.time))
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 25
    },
    scales: {
      y: {
        grace: 10,
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function(tickValue: string | number, index: number, ticks: Tick[]) {
            const value = new Date(chartData.labels[index])
            if (isNaN(value.getTime())) {
              console.error("Failed to parse date: ", data[index])
              return ""
            }

            return value.toLocaleDateString("en-US", { 
              year: "2-digit", 
              month: "numeric", 
              day: "numeric", 
              hour: "numeric", 
              minute: "numeric",
              second: "numeric"
            })
          }
        },
      }
    }
  }

  const headerStyle = {
    justifySelf: "center",
    fontFamily: "GoogleSans",
  }

  return (
    <div style={{ height: "75vh" }}>
      <h1 style={headerStyle}>Temperature & Humidity</h1>
      <Line data={chartData} options={options}/>
    </div>
  )
}

export default DataChart
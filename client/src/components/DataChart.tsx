/**
 * Renders a chart displaying temperature & humidity over time.
 */

import { useState, useEffect } from "react"
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

function DataChart({ newData }: { newData: Buffer<ArrayBufferLike> }) {
  const [maxPoints, setMaxPoints] = useState<number>(20)
  const [data, setData] = useState<Array<any>>([])
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      { label: 'Temperature', data: [] }, 
      { label: 'Humidity', data: [] }
    ]
  })

  useEffect(() => {
    async function fetchAPIData() {
      try {
        const response = await fetchData()
        setData(response)
      } catch (error) {
        console.error("Error fetching sensor data: ", error)
      }
    }
    fetchAPIData()
  }, [])

  useEffect(() => {
    if (!data.length) return

    // Limit number of datapoints to prevent crowding
    const datapoints = data.slice(0, maxPoints)

    setChartData({
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
    })
  }, [data])

  useEffect(() => {
    setData(prevData => [...prevData, newData])
  }, [newData])

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
            return new Date(data[index].time).toLocaleDateString("en-US", { 
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
    justifySelf: 'center',
    fontFamily: 'GoogleSans',
  }

  const graphStyle = {
  }

  return (
    <div style={{ height: '75vh' }}>
      <h1 style={headerStyle}>Temperature & Humidity</h1>
      <Line data={chartData} options={options} style={graphStyle}/>
    </div>
  )
}

export default DataChart
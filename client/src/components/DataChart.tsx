/**
 * Renders a chart displaying data over time.
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
  Legend
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

    setChartData({
      labels: data.map((e) => e.time),
      datasets: [
        {
          label: 'Temperature',
          data: data.map((e) => e.temperature)
        },
        {
          label: 'Humidity',
          data: data.map((e) => e.humidity)
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
      padding: 40
    },
    scales: {
      y: {
        grace: 10
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function(_: string, index: number, ticks: []) {
            return new Date(data[index].time).toLocaleDateString("en-US", { 
              year: "2-digit", 
              month: "numeric", 
              day: "numeric", 
              hour: "numeric", 
              minute: "numeric" 
            })
          }
        }
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
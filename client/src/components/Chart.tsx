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
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function DataChart() {
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
      setData(await fetchData())
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default DataChart
/**
 * Renders a chart displaying data over time.
 */

import { useState, useEffect } from "react"
import { fetchData } from "./api"
import { Line } from "react-chartjs-2"

function DataChart() {
  const [data, setData] = useState<Array<any>>([])

  useEffect(() => {
    async function fetchAPIData() {
      setData(await fetchData())
    }

    fetchAPIData()
  }, [])

  const chartData = {
    labels: ['11', '12'],
    datasets: [
      {
        label: 'Temperature',
        data: [21, 25]
      },
      {
        label: 'Humidity',
        data: [40, 55]
      }
    ]
  }

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
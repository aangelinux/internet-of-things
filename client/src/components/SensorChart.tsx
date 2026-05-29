/**
 * Renders a chart displaying temperature & humidity over time.
 */

import useChart from "../hooks/useChart"
import { ClimateData } from "../utils/types"
import { formatTick } from "../utils/dataParser"
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

function SensorChart({ realtimeData }: { realtimeData: ClimateData | null }) {
  const chartData = useChart(realtimeData)

  const headerStyle = {
    justifySelf: "center",
    fontFamily: "GoogleSans",
    color: "#274c77",
    marginTop: 40,
    margin: 0
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 50,
    },
    scales: {
      y: {
        grace: 10,
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function(
            tickValue: string | number, 
            index: number, 
            ticks: Tick[]
          ) { 
            return formatTick(index, chartData)
          },
        },
      },
    },
  }

  return (
    <div style={{ height: "75vh" }}>
      <h1 style={headerStyle}>Temperature & Humidity</h1>
      <Line data={chartData} options={options}/>
    </div>
  )
}

export default SensorChart
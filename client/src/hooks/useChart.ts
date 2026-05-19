/**
 * Custom hook containing logic for the Chart component.
 */

import { ClimateData, ChartData } from "../utils/types"
import { useState, useEffect, useMemo } from "react"
import { fetchData } from "../services/api"
import { isValid } from "../utils/dataParser"

function useChart(newData: ClimateData | null) {
  const [data, setData] = useState<ClimateData[]>([])
  const maxDatapoints = 20

  const emptyChartData = {
    labels: [],
    datasets: [
      { label: "Temperature", data: [], borderColor: "teal" },
      { label: "Humidity", data: [], borderColor: "purple" }
    ]
  }

  useEffect(() => {
    async function fetchAPIData() {
      try {
        const response = await fetchData(maxDatapoints)
        setData(response.filter((entry) => isValid(entry)))
      } catch (error) {
        console.error("Error fetching sensor data: ", error)
      }
    }
    fetchAPIData()
  }, [])

  const chartData: ChartData = useMemo(() => {
    try {
      return { 
        labels: data.map((e) => e.time),
        datasets: [
          {
            label: "Temperature",
            data: data.map((e) => e.temperature),
            borderColor: "teal"
          },
          {
            label: "Humidity",
            data: data.map((e) => e.humidity),
            borderColor: "purple"
          }
        ]
      }
    } catch (error) {
      console.error("Unable to calculate chart data: ", error)
    }

    return emptyChartData
  }, [data])

  useEffect(() => {
    if (!newData || !isValid(newData)) {
      console.error("Malformed data: ", newData)
      return
    }

    setData(prevData => [...prevData.slice(-maxDatapoints), newData])
  }, [newData])

  return chartData
}

export default useChart
/**
 * Custom hook containing logic for the Chart component.
 */

import { ClimateData, ChartData } from "../utils/types"
import { useState, useEffect, useMemo } from "react"
import { fetchData } from "../services/api"
import { isValid } from "../utils/dataParser"

function useChart(newData: ClimateData) {
  const [maxPoints, setMaxPoints] = useState<number>(20)
  const [data, setData] = useState<ClimateData[]>([])

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

  return chartData
}

export default useChart
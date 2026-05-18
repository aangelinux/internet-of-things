/**
 * Renders a dashboard displaying charts of sensor data.
 */

import { Buffer } from "buffer"
import { useEffect, useState } from "react"
import { connectMQTT } from "./mqtt"
import styles from "../styles/Dashboard.module.css"
import DataChart from "./DataChart"

interface ClimateData {
  time: string
  temperature: number
  humidity: number
}

function Dashboard() {
  const [newData, setNewData] = useState<ClimateData>({ time: "", temperature: 0, humidity: 0 })

  useEffect(() => {
    connectMQTT(setNewData)
  }, [])

  return (
    <div className={styles.page}><DataChart newData={newData} /></div>
  )
}

export default Dashboard
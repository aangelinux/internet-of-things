/**
 * Renders a dashboard displaying a sensor-data chart and a LED button.
 */

import { useEffect, useState } from "react"
import styles from "../styles/Dashboard.module.css"
import Broker from "./broker"
import DataChart from "./DataChart"
import LEDButton from "./LEDButton"

interface ClimateData {
  time: string
  temperature: number
  humidity: number
}

function Dashboard() {
  const [newData, setNewData] = useState<ClimateData>({ time: "", temperature: 0, humidity: 0 })
  const [ledState, setLedState] = useState<string>("")

  const broker = Broker.Instance

  useEffect(() => {
    broker.subscribe((data) => {
      setNewData(data)
    })
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.chart}><DataChart newData={newData} /></div>
      <div className={styles.button}>
        <LEDButton broker={broker} ledState={ledState} /></div>
    </div>
  )
}

export default Dashboard
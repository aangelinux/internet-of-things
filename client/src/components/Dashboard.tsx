/**
 * Renders a dashboard displaying a sensor-data chart and a LED button.
 */

import { ClimateData } from "../utils/types"
import { useEffect, useState } from "react"
import styles from "../styles/Dashboard.module.css"
import Broker from "../services/broker"
import DataChart from "./DataChart"
import LED from "./LED"

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
      <div className={styles.led}>
        <LED broker={broker} ledState={ledState} /></div>
    </div>
  )
}

export default Dashboard
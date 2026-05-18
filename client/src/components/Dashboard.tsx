/**
 * Renders a dashboard displaying charts of sensor data.
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
  const [broker, setBroker] = useState<Broker | null>(null)

  useEffect(() => {
    setBroker(Broker.Instance)

    Broker.Instance.SetNewData = setNewData
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.chart}><DataChart newData={newData} /></div>
      <div className={styles.button}><LEDButton broker={broker ?? Broker.Instance}/></div>
    </div>
  )
}

export default Dashboard
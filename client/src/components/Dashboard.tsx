/**
 * Renders a dashboard displaying a sensor-data chart and LED controls.
 */

import { ClimateData } from "../utils/types"
import { useEffect, useState } from "react"
import styles from "../styles/Dashboard.module.css"
import Broker from "../services/broker"
import SensorChart from "./SensorChart"
import LEDControls from "./LEDControls"

function Dashboard() {
  const [ledState, setLedState] = useState<string>("OFF")
  const [newData, setNewData] = useState<ClimateData>({ 
    time: "", temperature: 0, humidity: 0 
  })

  const broker = Broker.Instance

  useEffect(() => {
    broker.subscribeToSensor((data) => {
      setNewData(data)
    })
    broker.subscribeToLED((state) => {
      setLedState(state)
    })

    return () => broker.disconnect()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.chart}><SensorChart newData={newData} /></div>
      <div className={styles.led}><LEDControls broker={broker} ledState={ledState} /></div>
    </div>
  )
}

export default Dashboard
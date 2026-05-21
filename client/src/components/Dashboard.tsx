/**
 * Renders a dashboard displaying a sensor-data chart and LED controls.
 */

import { ClimateData, LEDState } from "../utils/types"
import { useEffect, useState } from "react"
import styles from "../styles/Dashboard.module.css"
import SensorChart from "./SensorChart"
import LEDControls from "./LEDControls"
import WSConnection from "../services/wsConnection"

function Dashboard() {
  const [ledState, setLedState] = useState<LEDState>({ ledState: "OFF" })
  const [realtimeData, setRealtimeData] = useState<ClimateData | null>(null)

  const ws = new WSConnection()

  useEffect(() => {
    ws.connect()

    ws.subscribeToLED((state) => {
      setLedState(state)
    })
    ws.subscribeToSensor((data) => {
      setRealtimeData(data)
    })

    return () => ws.disconnect()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.chart}>
        <SensorChart realtimeData={realtimeData} />
      </div>
      <div className={styles.led}>
        <LEDControls ws={ws} ledState={ledState} />
      </div>
    </div>
  )
}

export default Dashboard
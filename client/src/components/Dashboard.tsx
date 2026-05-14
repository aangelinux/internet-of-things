/**
 * Renders a dashboard displaying charts of sensor data.
 */

import { useEffect } from "react"
import { connectMQTT } from "./mqtt"
import styles from "../styles/Dashboard.module.css"
import DataChart from "./Chart"

function Dashboard() {
  useEffect(() => {
    connectMQTT()
  }, [])

  return (
    <div className={styles.page}><DataChart /></div>
  )
}

export default Dashboard
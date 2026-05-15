/**
 * Renders a dashboard displaying charts of sensor data.
 */

import { Buffer } from "buffer"
import { useEffect, useState } from "react"
import { connectMQTT } from "./mqtt"
import styles from "../styles/Dashboard.module.css"
import DataChart from "./DataChart"

function Dashboard() {
  const [newData, setNewData] = useState<Buffer<ArrayBufferLike>>(Buffer.from([]))

  useEffect(() => {
    connectMQTT(setNewData)
  }, [])

  return (
    <div className={styles.page}><DataChart newData={newData} /></div>
  )
}

export default Dashboard
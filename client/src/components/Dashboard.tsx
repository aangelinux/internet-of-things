/**
 * Renders a dashboard displaying charts of sensor data.
 */

import styles from "../styles/Dashboard.module.css"
import DataChart from "./Chart"

function Dashboard() {
  return (
    <div className={styles.page}><DataChart /></div>
  )
}

export default Dashboard
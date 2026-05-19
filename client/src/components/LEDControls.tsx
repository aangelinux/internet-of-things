/**
 * Renders buttons for controlling LED state on an IoT device.
 */

import { Button } from "@mui/material"
import Broker from "../services/broker"

function LEDControls({ broker, ledState }: { broker: Broker, ledState: string }) {
  const handleClick = (state: string) => {
    if (state === "ON" || "OFF") {
      const command = JSON.stringify({
        msg: state
      })
      broker.publish(command)
    }
  }

  const color = () => {
    return ledState === "ON" ? "green" : "red"
  }

  const headerStyle: Object = {
    display: "flex", 
    justifySelf: "center", 
    fontFamily: "GoogleSans", 
    flexDirection: "row",
    gap: 10,
  }

  return (
    <div>
      <div style={headerStyle}>
        <h1>LED State:</h1>
        <h1 style={{ color: color() }}>{ledState}</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button
          variant="contained"
          size="large"
          sx={{ margin: 1 }}
          onClick={() => handleClick("ON")}
        >
          Turn ON
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{ margin: 1 }}
          onClick={() => handleClick("OFF")}
        >
          Turn OFF
        </Button>
      </div>

    </div>
  )
}

export default LEDControls
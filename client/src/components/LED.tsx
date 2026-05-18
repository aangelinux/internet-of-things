/**
 * Renders a button for controlling LED state on a Wokwi simulator.
 */

import { Button } from "@mui/material"
import Broker from "../services/broker"

function LED({ broker, ledState }: { broker: Broker, ledState: string }) {
  const handleClick = (state: string) => {
    if (state === "ON" || "OFF") {
      const command = JSON.stringify({
        msg: state
      })
      broker.publish(command)
    }
  }

  return (
    <div>
      <h1 style={{ justifySelf: "center" }}>Update LED</h1>
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
  )
}

export default LED
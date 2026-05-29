/**
 * Renders buttons for controlling LED state on an IoT device.
 */

import { Button } from "@mui/material"
import { WSConnectionInterface, LEDState } from "../utils/types"

function LEDControls({ ws, ledState }: 
  { ws: WSConnectionInterface, ledState: LEDState }
) {
  const handleClick = (state: string) => {
    if (state === "ON" || state === "OFF") {
      const command = JSON.stringify({
        msg: state
      })
      ws.broadcast(command)
    }
  }

  const color = () => {
    return ledState.ledState === "ON" ? "green" : "red"
  }

  const divStyle = {
    backgroundColor: "#274c77", 
    padding: 30, 
    borderRadius: 10
  }

  const headerStyle: Object = {
    display: "flex", 
    justifySelf: "center", 
    fontFamily: "GoogleSans", 
    flexDirection: "row",
    gap: 10,
    color: "#e7ecef"
  }

  return (
    <div style={divStyle}>
      <div style={headerStyle}>
        <h1>LED State:</h1>
        <h1 style={{ color: color() }}>{ledState.ledState}</h1>
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
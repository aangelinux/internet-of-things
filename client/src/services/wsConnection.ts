/**
 * Connection to a WebSocket.
 */

import { ClimateData, LEDState, WSConnectionInterface } from "../utils/types"

class WSConnection implements WSConnectionInterface {
  private socket: WebSocket | null = null
  private sensorListeners: ((data: ClimateData) => void)[] = []
  private ledListeners: ((state: LEDState) => void)[] = []

  private callbacks() {
    if (!this.socket) return

    this.socket.onopen = (event) => {
      console.log("WebSocket connected: ", event)
    }
    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected: ", event)
    }
    this.socket.onmessage = (event) => {
      console.log("Incoming message: ", event)
    }
  }

  connect() {
    this.socket = new WebSocket("/ws")

    this.callbacks()
  }

  subscribeToSensor(listener: (data: ClimateData) => void) {
    this.sensorListeners.push(listener)
  }

  subscribeToLED(listener: (state: LEDState) => void) {
    this.ledListeners.push(listener)
  }

  notifySensor(data: ClimateData) {
    this.sensorListeners.forEach((listener) => listener(data))
  }

  notifyLED(state: LEDState) {
    this.ledListeners.forEach((listener) => listener(state))
  }

  broadcast(message: string) {
    console.log("Broadcasting ... ", message)
    this.socket?.send(message)
  }

  disconnect() {
    this.socket?.close()
  }
}

export default WSConnection
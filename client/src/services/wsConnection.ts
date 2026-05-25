/**
 * Singleton connection to a WebSocket serving real-time sensor data and LED state.
 */

import { 
  ClimateData, 
  LEDMessage, 
  LEDState, 
  SensorMessage, 
  WSConnectionInterface 
} from "../utils/types"

class WSConnection implements WSConnectionInterface {
  private static _instance: WSConnection | null = null

  private socket: WebSocket | null = null
  private sensorListeners: ((data: ClimateData) => void)[] = []
  private ledListeners: ((state: LEDState) => void)[] = []

  private constructor() {
    this.socket = new WebSocket(import.meta.env.VITE_WS_URL)

    this.callbacks()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  private callbacks() {
    if (!this.socket) return

    this.socket.onopen = (event) => {
      console.log("WebSocket connected: ", event)
    }
    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected: ", event)
    }
    this.socket.onmessage = (event) => {
      console.log("Incoming message: ", event.data)
      this.handleIncoming(event.data)
    }
    this.socket.onerror = (event) => {
      console.log("WebSocket error: ", event)
    }
  }

  private handleIncoming(message: string) {
    try {
      const parsed: LEDMessage | SensorMessage = JSON.parse(message)

      if (parsed.type === "sensor") {
        this.notifySensor(parsed.data)
      }
      if (parsed.type === "ledState") {
        const state: LEDState = { "ledState": parsed.data }
        this.notifyLED(state)
      }
    } catch (error) {
      console.log("Error parsing WS message: ", error)
    }
  }

  private notifySensor(data: ClimateData) {
    this.sensorListeners.forEach((listener) => listener(data))
  }

  private notifyLED(state: LEDState) {
    this.ledListeners.forEach((listener) => listener(state))
  }

  subscribeToSensor(listener: (data: ClimateData) => void) {
    this.sensorListeners.push(listener)
  }

  subscribeToLED(listener: (state: LEDState) => void) {
    this.ledListeners.push(listener)
  }

  broadcast(message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log("Broadcasting ... ", message)
      this.socket.send(message)
    } else {
      console.log("Socket not open: ", this.socket?.readyState)
    }
  }

  disconnect() {
    this.socket?.close()
  }
}

export default WSConnection
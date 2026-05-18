/**
 * Singleton connection to an MQTT Broker.
 */

import { ClimateData } from "../utils/types"
import mqtt from "mqtt"

type LEDState = "ON" | "OFF"

class Broker {
  private clientID: string
  private client: mqtt.MqttClient | null
  private sensorListeners: ((data: ClimateData) => void)[] = []
  private ledListeners: ((state: LEDState) => void)[] = []

  private static _instance: Broker

  private constructor() {
    this.clientID = "mqtt_" + Math.random().toString(16).substring(2, 10)
    this.client = null

    this.connect()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  private setCallbacks() {
    this.client?.on("error", (error) => {
      console.error("Connection error: ", error)
      this.client?.end()
    })
    this.client?.on("reconnect", () => {
      console.log("Reconnecting ...")
    })
    this.client?.on("connect", () => {
      console.log(`Client connected: ${this.clientID}`)
      this.client?.subscribe("lnu/iot/al227bn/sensor", { qos: 0 })
      this.client?.subscribe("lnu/iot/al227bn/led/state", { qos: 0 })
    })

    this.client?.on("message", (topic, message, packet) => {
      console.log(`Received message: ${message.toString()}, on topic: ${topic}`)

      if (topic === "lnu/iot/al227bn/sensor") {
        try {
          const parsedData = JSON.parse(message.toString())
          this.notifySensor(parsedData)
        } catch (error) {
          console.error("Could not parse sensor data: ", error)
        }
      }

      if (topic === "lnu/iot/al227bn/led/state") {
        try {
          const parsedState = JSON.parse(message.toString()).ledState
          this.notifyLED(parsedState)
        } catch (error) {
          console.error("Could not parse LED state: ", error)
        }
      }
    })
  }

  private notifySensor(data: ClimateData) {
    this.sensorListeners.forEach((listener) => listener(data))
  }

  private notifyLED(state: LEDState) {
    this.ledListeners.forEach((listener) => listener(state))
  }

  subscribeSensorData(listener: (data: ClimateData) => void) {
    this.sensorListeners.push(listener)
  }

  subscribeLED(listener: (state: LEDState) => void) {
    this.ledListeners.push(listener)
  }

  connect() {
    const host = "wss://broker.emqx.io:8084/mqtt"
    const options: mqtt.IClientOptions = {
      keepalive: 60,
      clientId: this.clientID,
      protocolId: "MQTT",
      protocolVersion: 5,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 3 * 1000,
    }

    console.log("Connecting to MQTT Client ...")

    this.client = mqtt.connect(host, options)
    this.setCallbacks()
  }

  publish(command: string) {
    this.client?.publish("lnu/iot/al227bn/command/led", command)
  }
}

export default Broker
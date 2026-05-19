/**
 * Singleton connection to an MQTT Broker.
 */

import { BrokerInterface, ClimateData, LEDState } from "../utils/types"
import mqtt from "mqtt"

class Broker implements BrokerInterface {
  private clientID: string
  private client: mqtt.MqttClient | null = null
  private sensorListeners: ((data: ClimateData) => void)[] = []
  private ledListeners: ((state: LEDState) => void)[] = []

  private sensorTopic = "lnu/iot/al227bn/sensor"
  private ledStateTopic = "lnu/iot/al227bn/led/state"
  private ledCommandTopic = "lnu/iot/al227bn/command/led"

  private static _instance: Broker

  private constructor() {
    this.clientID = "mqtt_" + Math.random().toString(16).substring(2, 10)

    this.connect()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  private connect() {
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
    this.callbacks()
  }

  private callbacks() {
    this.client?.on("error", (error) => {
      console.error("Connection error: ", error)
      this.client?.end()
    })
    this.client?.on("reconnect", () => {
      console.log("Reconnecting ...")
    })
    this.client?.on("connect", () => {
      console.log(`Client connected: ${this.clientID}`)
      this.client?.subscribe(this.sensorTopic, { qos: 0 })
      this.client?.subscribe(this.ledStateTopic, { qos: 0 })
    })
    this.client?.on("message", (topic, message, packet) => {
      console.log(`Message: ${message.toString()}, topic: ${topic}`)
      this.handleMessage(topic, message)
    })
  }

  private handleMessage(topic: string, message: Buffer) {
    if (topic === this.sensorTopic) {
      try {
        const parsedData: ClimateData = JSON.parse(message.toString())
        this.notifySensor(parsedData)
      } catch (error) {
        console.error("Could not parse sensor data: ", error)
      }
    }
    if (topic === this.ledStateTopic) {
      try {
        const parsedState: LEDState = JSON.parse(message.toString())
        this.notifyLED(parsedState)
      } catch (error) {
        console.error("Could not parse LED state: ", error)
      }
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

  publish(command: string) {
    this.client?.publish(this.ledCommandTopic, command)
  }

  disconnect() {
    this.client?.end()

    this.ledListeners = []
    this.sensorListeners = []
  }
}

export default Broker
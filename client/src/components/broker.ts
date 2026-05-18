/**
 * Singleton connection to an MQTT Broker.
 */

import { Buffer } from 'buffer'
import mqtt from "mqtt"

interface ClimateData {
  time: string
  temperature: number
  humidity: number
}

class Broker {
  private clientID: string
  private client: mqtt.MqttClient | null
  private setNewData: React.Dispatch<React.SetStateAction<ClimateData>> | null

  private static _instance: Broker

  private constructor() {
    this.clientID = "mqtt_" + Math.random().toString(16).substring(2, 10)
    this.client = null
    this.setNewData = null

    this.connect()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public set SetNewData(setter: React.Dispatch<React.SetStateAction<ClimateData>>) {
    this.setNewData = setter
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
    })
    this.client?.on("message", (topic, message, packet) => {
      console.log(`Received message: ${message.toString()}, on topic: ${topic}`)
      this.setMessage(message)
    })
  }

  private setMessage(message: Buffer<ArrayBufferLike>) {
    let parsedMessage
    try {
      parsedMessage = JSON.parse(message.toString())
    } catch (error) {
      console.error("Could not parse message: ", message)
    }

    this.setNewData?.(parsedMessage)
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
/**
 * Sets up an MQTT connection over a Web Socket instance.
 */

import mqtt from "mqtt"

export function connectMQTT() {
  const clientID = "mqtt_" + Math.random().toString(16).substring(2, 10)
  const host = "wss://broker.emqx.io:8084/mqtt"
  const options: mqtt.IClientOptions = {
    keepalive: 60,
    clientId: clientID,
    protocolId: "MQTT",
    protocolVersion: 5,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 3 * 1000,
  }

  console.log("Connecting to MQTT Client ...")

  const client = mqtt.connect(host, options)

  client.on("error", (error) => {
    console.error("Connection error: ", error)
    client.end()
  })
  client.on("reconnect", () => {
    console.log("Reconnecting ...")
  })
  client.on("connect", () => {
    console.log(`Client connected: ${clientID}`)
    client.subscribe("lnu/iot/al227bn/sensor", { qos: 0 })
  })
  client.on("message", (topic, message, packet) => {
    console.log(`Received message: ${message.toString()}, on topic: ${topic}`)
  })
}
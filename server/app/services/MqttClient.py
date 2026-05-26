# Filename: MqttClient.py
# Description: Singleton connection to a HiveMQ broker.

import os
import ssl
import asyncio
import asyncio_mqtt as aiomqtt
from app.utils.dataValidator import parse_json, validate

class MQTTClient:
    def __init__(self, on_sensor, on_led):
        self.client = aiomqtt.Client(
            hostname=os.getenv("HIVEMQ_URL"),
            port=int(os.getenv("HIVEMQ_PORT")),
            username="aangelinux",
            password=os.getenv("HIVEMQ_PASSWORD"),
            tls_context=ssl.create_default_context(),
            client_id="backend"
        )

        self.on_sensor = on_sensor
        self.on_led = on_led

        self.led_state_topic = "lnu/iot/al227bn/led/state"
        self.led_command_topic = "lnu/iot/al227bn/command/led"
        self.sensor_topic = "lnu/iot/al227bn/sensor"


    async def main(self):
        reconnect_interval = 5
        while True:
            try:
                await self.client.__aenter__()
                await self.client.subscribe(self.sensor_topic)
                await self.client.subscribe(self.led_state_topic)

                asyncio.create_task(self.listen())

            except aiomqtt.MqttError as error:
                print(f'Error: {error}. Reconnecting in {reconnect_interval} sec.')
                await asyncio.sleep(reconnect_interval)

    async def listen(self):
        async with self.client.messages() as messages:
            async for message in messages:
                print("Received MQTT message: ", message.payload)
                await self.handle_messages(message)

    async def handle_messages(self, message):
        if message.topic.matches(self.sensor_topic):
            climate_data = self.parse_sensor(message.payload)
            if climate_data is not None:
                await self.on_sensor(climate_data)

        if message.topic.matches(self.led_state_topic):
            led_state = self.parse_led(message.payload)
            if led_state is not None:
                await self.on_led(led_state)

    def parse_sensor(self, data):
        json_data = parse_json(data)
        if json_data is None:
            return None

        climate_data = validate(json_data)
        if climate_data is None:
            return None

        return climate_data

    def parse_led(self, state):
        json_state = parse_json(state)
        if json_state is None:
            return None
        
        led_state = json_state.get("ledState")
        if led_state not in ["ON", "OFF"]:
            return None

        return led_state

    async def publish(self, command):
        await self.client.publish(self.led_command_topic, command)
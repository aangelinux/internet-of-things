# Filename: Mqtt.py
# Description: Singleton MQTT connection with pub/sub architecture.

import os
import asyncio
import paho.mqtt.client as paho
from paho import mqtt
from db.repository import write_data
from db.dataValidator import parse_json, validate

class MQTTBroker:
    instance = None

    def __new__(cls):
        if cls.instance is None:
            cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        if not hasattr(self, "_initialized"):
            self.client = None
            self.queue = asyncio.Queue()
            self._initialized = True
            self.led_state_topic = "lnu/iot/al227bn/led/state"
            self.led_command_topic = "lnu/iot/al227bn/command/led"
            self.sensor_topic = "lnu/iot/al227bn/sensor"

    def connect(self, db_client):
        """Connects to an MQTT broker."""
        self.client = paho.Client(
            client_id="", 
            userdata=None, 
            protocol=paho.MQTTv5
        )

        self.client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
        self.client.username_pw_set("aangelinux", os.getenv("PASSWORD"))

        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        self.client.connect(os.getenv("HIVEMQ_URL"), 8883)
        self.client.loop_start()

        self.client.user_data_set({
            "db_client": db_client
        })

    def on_connect(self, client, userdata, flags, rc, properties=None):
        if (rc != 0):
            print("Disconnected, rc = ", rc)

        print("Connected to MQTT Broker")
        self.client.subscribe(self.sensor_topic)
        self.client.subscribe(self.led_state_topic)

    def on_message(self, client, userdata, msg):
        print("Received message: ", msg.payload)

        if msg.topic == self.sensor_topic:
            climate_data = self.parse_sensor(msg.payload)
            if climate_data is not None:
                write_data(userdata["db_client"], climate_data)
                self.queue.put_nowait({
                    "type": "sensor",
                    "data": climate_data
                })

        if msg.topic == self.led_state_topic:
            led_state = self.parse_led(msg.payload)
            if led_state is not None:
                self.queue.put_nowait({
                    "type": "led",
                    "data": led_state
                })

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

    def publish(self, command):
        self.client.publish(self.led_command_topic, command)

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
# Filename: mqtt.py
# Description: Establishes a connection with an MQTT Broker.

import paho.mqtt.client as mqtt
from db.repository import write_data

# Callback functions
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")
    client.subscribe("lnu/iot/al227bn/sensor")

def on_message(client, userdata, msg):
    db = userdata["db_client"]
    write_data(db, msg.payload)


def create_mqtt_client():
    return mqtt.Client()

def connect(client):
    """Connects to an MQTT broker."""
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("broker.emqx.io", 1883, 60)
    client.loop_start()
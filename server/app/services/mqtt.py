# Filename: mqtt.py
# Description: Establishes a connection with an MQTT Broker.

import os
import paho.mqtt.client as paho
from paho import mqtt
from db.repository import write_data

# Callback functions
def on_connect(client, userdata, flags, rc, properties=None):
    if (rc != 0):
        print("Disconnected, rc = ", rc)

    print("Connected to MQTT Broker")
    client.subscribe("lnu/iot/al227bn/sensor")

def on_message(client, userdata, msg):
    print("Received message")
    db = userdata["db_client"]
    write_data(db, msg.payload)


def create_mqtt_client():
    return paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)

def connect(client):
    """Connects to an MQTT broker."""
    client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
    client.username_pw_set("aangelinux", os.getenv("PASSWORD"))

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(os.getenv("HIVEMQ_URL"), 8883)
    client.loop_start()
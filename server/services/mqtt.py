# Filename: mqtt.py
# Description: Establishes a connection with an MQTT Broker.

import paho.mqtt.client as mqtt

# Callback functions
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")
    client.subscribe("lnu/iot/al227bn/sensor")

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


def create_client():
    return mqtt.Client()

def connect_mqtt(client):
    """Connects to an MQTT broker."""
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("broker.emqx.io", 1883, 60)
    client.loop_start()
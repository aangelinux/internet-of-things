# Filename: main.py
# Description: Configures a FastAPI server for writing & querying data.

import asyncio

from dotenv import load_dotenv
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from api.router import router
from services.ConnectionManager import ConnectionManager
from services.MqttBroker import MQTTBroker
from services.DBClient import DBClient

load_dotenv()

origins = ["*"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = DBClient()
    mqtt_broker = MQTTBroker()
    DBClient.connect(db_client)
    MQTTBroker.connect(mqtt_broker)

    app.state.db_client = db_client
    app.state.mqtt_broker = mqtt_broker

    asyncio.create_task(mqtt_worker(mqtt_broker, db_client))

    yield

    app.state.mqtt_broker.disconnect()
    app.state.db_client.disconnect()
    print("Server disconnected")


app = FastAPI(lifespan=lifespan)

app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins
)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            command = await websocket.receive_json()
            MQTTBroker.publish(command)

    except WebSocketDisconnect as e:
        manager.disconnect()
        print("WebSocket disconnected: ", e)

async def mqtt_worker(mqtt, db):
    while True:
        event = await mqtt.queue.get()

        if event.get("type") == "sensor":
            db.write_data(event.get("data"))

        await manager.broadcast(event)
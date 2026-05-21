# Filename: main.py
# Description: Configures a FastAPI server for writing & querying data.

import asyncio

from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from api.router import router
from db.connect import create_db_client
from services.ConnectionManager import ConnectionManager
from services.MqttBroker import MQTTBroker

origins = ["*"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = create_db_client()
    mqtt_client = MQTTBroker()
    MQTTBroker.connect(mqtt_client, db_client)

    app.state.db_client = db_client
    app.state.mqtt_client = mqtt_client

    asyncio.create_task(mqtt_worker(mqtt_client))

    yield

    app.state.mqtt_client.disconnect()
    app.state.db_client.close()
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

async def mqtt_worker(client):
    while True:
        event = await client.queue.get()

        await manager.broadcast(event)
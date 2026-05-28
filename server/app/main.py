# Filename: main.py
# Description: Configures a FastAPI server for writing & querying data.

import asyncio

from dotenv import load_dotenv
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.services.ConnectionManager import ConnectionManager
from app.services.MqttClient import MQTTClient
from app.services.DBClient import DBClient

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = DBClient()
    db_client.connect()
    mqtt_client = MQTTClient(
        on_sensor=handle_sensor,
        on_led=handle_led
    )
    mqtt_task = asyncio.create_task(mqtt_client.main())

    app.state.db_client = db_client
    app.state.mqtt_client = mqtt_client
    app.state.mqtt_task = mqtt_task

    yield

    app.state.mqtt_task.cancel()
    app.state.db_client.disconnect()
    print("Server disconnected")

app = FastAPI(lifespan=lifespan)
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"]
)

manager = ConnectionManager()

async def handle_sensor(data):
    # Schedule DB write to avoid blocking the event loop
    asyncio.create_task(asyncio.to_thread(
        app.state.db_client.write_data, data))

    await manager.broadcast({
        "type": "sensor",
        "data": data
    })

async def handle_led(state):
    await manager.broadcast({
        "type": "ledState",
        "data": state
    })

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            try:
                command = await websocket.receive_text()
                print("Received WS message:", command)
                await app.state.mqtt_client.publish(command)
            except WebSocketDisconnect:
                print("WebSocket disconnected")
                break
            except Exception as e:
                print("WS error:", e)
    finally:
        manager.disconnect(websocket)
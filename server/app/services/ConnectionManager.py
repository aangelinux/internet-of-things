# Filename: ConnectionManager.py
# Description: Handles a WebSocket connection.

import asyncio
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

        print("WebSocket connected")

    async def broadcast(self, message: dict):
        # Sensor data is of type ClimateData so must be converted to a dict
        if message["type"] == "sensor":
            data = message["data"].model_dump()
        else:
            data = message["data"]

        payload = {
            "type": message["type"],
            "data": data
        }

        # Send to all connections concurrently and await the sends
        coros = [connection.send_json(payload) for connection in self.active_connections]
        if coros:
            await asyncio.gather(*coros, return_exceptions=True)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
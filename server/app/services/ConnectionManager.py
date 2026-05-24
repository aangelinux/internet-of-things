# Filename: ConnectionManager.py
# Description: Handles a WebSocket connection.

import json
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("WebSocket connected")

    async def broadcast(self, message: json):
        # If data is of type ClimateData, it must be serialized first
        if message["type"] == "sensor":
            data = message["data"].model_dump()
        else:
            data = message["data"]

        payload = { 
            "type": message["type"],
            "data": data
        }

        for connection in self.active_connections:
            await connection.send_json(payload)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
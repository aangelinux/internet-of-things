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

    async def broadcast(self, message: str):
        parsed = json.dumps({ 
            "type": message.get("type"), 
            "data": str(message.get("data"))
        })

        for connection in self.active_connections:
            await connection.send_json(parsed)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
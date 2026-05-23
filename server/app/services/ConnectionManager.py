# Filename: ConnectionManager.py
# Description: Handles a WebSocket connection.

from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("WebSocket connected")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_json(message)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
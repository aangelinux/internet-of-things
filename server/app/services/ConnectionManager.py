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
        if message["type"] == "sensor":  
            # Data is an object so must be converted to a dict
            data = message["data"].model_dump()
        else:
            data = message["data"]

        payload = { "type": message["type"], "data": data }
        coros = [connection.send_json(payload) 
                 for connection in self.active_connections]
        if coros:  # Send concurrently instead of one at a time
            results = await asyncio.gather(*coros, return_exceptions=True)

            # Remove dead connections
            for connection, result in zip(self.active_connections[:], results):
                if isinstance(result, Exception):
                    self.active_connections.remove(connection)
                    print ("Removed WS connection: ", connection)

    def disconnect(self, websocket: WebSocket):
        try:
            self.active_connections.remove(websocket)
        except Exception as e:
            print("Could not remove WS connection: ", e)

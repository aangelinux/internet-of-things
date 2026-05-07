# Filename: main.py
# Description: Configures a FastAPI server for writing & querying data.

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import router
from services.mqtt import create_client, connect_mqtt

@asynccontextmanager
async def lifespan(app: FastAPI):
  client = create_client()
  connect_mqtt(client)
  yield

  client.loop_stop()
  client.disconnect()
  print("MQTT Client disconnected")

origins = ["*"]

app = FastAPI(lifespan = lifespan)

app.include_router(router)
app.add_middleware(
  CORSMiddleware,
  allow_origins = origins
)